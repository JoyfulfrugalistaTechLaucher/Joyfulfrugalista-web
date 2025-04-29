'use client';
import React, { useState, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Modal,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { ref as dbRef, update } from 'firebase/database';
import { blobToURL, fromBlob } from 'image-resize-compress';
import { db } from '@/app/config/firebaseConfig';
import { User } from '@/app/interface';
import { useAuth } from '@/app/contexts/AuthContext';
import { DEFAULT_AVATAR } from '@/app/constants';
import { CircImgBox } from '@/app/components/ImgBox';

async function uploadUserAvatar(userId: string, file: File): Promise<string> {
   const storage = getStorage();

  // Create a storage reference for this specific user's avatar
  // this pattern ensures each user has their own avatar location
  // and new uploads will replace the old one
  const avatarRef = storageRef(storage, `avatars/${userId}-pfp.jpeg`);

  // Upload the file
  await uploadBytes(avatarRef, file);

  // Get the download URL for the uploaded file
  const downloadURL = await getDownloadURL(avatarRef);

  // Return the public URL that can be stored in the user's profile
  return downloadURL;
}

async function updateUserAvatarURL(userId: string, avatarURL: string): Promise<void> {
  const userRef = dbRef(db, `users/${userId}`);

  // Update only the avatar field
  await update(userRef, {
    avatar: avatarURL
  });
}

export function UserAvatar({ small, user }: {small: boolean, user: User}) {
  const { updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const open = Boolean(anchorEl);

 // State for modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
    handleMenuClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the selected compressed image
    const resizedBlob = await fromBlob(file, 80, 240, 240, 'jpeg');
    const url = await blobToURL(resizedBlob);

    // Convert Blob to File by creating a new File object
    const resizedFile = new File([resizedBlob], file.name, {
      type: 'image/jpeg',
      lastModified: new Date().getTime()
    });

    // Store the file and preview URL in state
    setSelectedFile(resizedFile);

    // Check if url is a string before setting it
    if (typeof url === 'string') {
      setPreviewUrl(url);
    } else {
      console.error('Failed to set new image url');
      return;
    }

    // Open the confirmation modal
    setUploadModalOpen(true);

    // Clear the file input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleModalClose = () => {
    // Close the modal and clean up the preview URL
    setUploadModalOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      // firebase upload logic here
      const downloadURL = await uploadUserAvatar(user.id, selectedFile);
      await updateUserAvatarURL(user.id, downloadURL);

      // update the auth context
      await updateUserProfile({ avatar: downloadURL });

      console.log("Image upload confirmed for:", selectedFile.name);

      // Close the modal after successful upload
      handleModalClose();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    handleMenuClose();
    setRemoveModalOpen(true);
  };

  const handleRemoveModalClose = () => {
    setRemoveModalOpen(false);
  };

  const handleRemoveConfirm = async () => {
    setUploading(true);

    try {
      // Update avatar to default in Firebase
      await updateUserAvatarURL(user.id, DEFAULT_AVATAR);

      // Update the auth context to reflect the change
      await updateUserProfile({ avatar: DEFAULT_AVATAR });

      console.log("Profile photo removed successfully");

      // Close modal after successful removal
      handleRemoveModalClose();
    } catch (error) {
      console.error("Error removing profile photo:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box component="div" className='avatar-container'>
      <CircImgBox
        imgSrc={user.avatar ?? DEFAULT_AVATAR}
        alt={`${user.name}'s profile image`}
        size={small ? 200 : 140}
      >
      </CircImgBox>
      <Button
        id="avatar-button"
        variant="contained"
        aria-label="upload new profile image"
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<EditIcon fontSize="small" />}
        onClick={handleMenuClick}
        size="small"
        className="avatar-btn"
      >
         Edit
      </Button>
      <Menu
        id="avatar-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={handleUploadPhoto}>Upload a photo</MenuItem>
        <MenuItem onClick={handleRemovePhoto}>Remove photo</MenuItem>
      </Menu>

      {/* hidden file input */}
      <input
        ref={fileInputRef}
        name="avatar"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Confirmation Modal */}
      <Modal
        open={uploadModalOpen}
        onClose={handleModalClose}
        aria-labelledby="preview-modal-title"
      >
        <Box className="avatar-modal">
          <Typography
            id="preview-modal-title"
            variant="h6"
            component="h2"
            className="mb-2"
          >Preview
          </Typography>

          {previewUrl && (
            <Box className="mb-3 flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="avatar-preview"
              />
            </Box>
          )}

          <Box className="flex gap-2">
            <Button
              variant="outlined"
              onClick={handleModalClose}
              disabled={uploading}
            >
               Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUploadConfirm}
              color="primary"
              disabled={uploading}
              loading={uploading}
            >
              {uploading ? 'Updating...' : 'Update Profile Photo'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        open={removeModalOpen}
        onClose={handleRemoveModalClose}
        aria-labelledby="remove-modal-title"
      >
        <Box className="avatar-modal">
          <Typography color="info" className="m-2 p-2 text-center">
            This will remove your current profile photo and use the default avatar instead.
          </Typography>

          <Box className="mb-3 flex justify-center">
            <img
              src={user.avatar ?? DEFAULT_AVATAR}
              alt="Current Avatar"
              className="avatar-preview"
            />
          </Box>

          <Box className="flex gap-2">
            <Button
              variant="outlined"
              onClick={handleRemoveModalClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleRemoveConfirm}
              color="error"
              disabled={uploading}
              loading={uploading}
            >
              {uploading ? 'Removing...' : 'Remove Photo'}
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
