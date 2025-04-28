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
  getDatabase,
  getStorage,
  ref as dbRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { User } from '@/app/interface';
import { DEFAULT_AVATAR } from '@/app/constants';
import { CircImgBox } from '@/app/components/ImgBox';

async function uploadUserAvatar(userId: string, file: File): Promise<string> {
   const storage = getStorage();

  // Create a storage reference for this specific user's avatar
  // this pattern ensures each user has their own avatar location
  // and new uploads will replace the old one
  const avatarRef = dbRef(storage, `avatars/${userId}`);

  // Upload the file
  await uploadBytes(avatarRef, file);

  // Get the download URL for the uploaded file
  const downloadURL = await getDownloadURL(avatarRef);

  // Return the public URL that can be stored in the user's profile
  return downloadURL;
}

async function updateUserAvatarURL(userId: string, avatarURL: string): Promise<void> {
  const db = getDatabase();
  const userRef = dbRef(db, `users/${userId}`);

  // Update only the avatar field
  await update(userRef, {
    avatar: avatarURL
  });
}


export function UserAvatar({ small, user }: {small: boolean, user: User}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

 // State for modal
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);

    // Store the file and preview URL in state
    setSelectedFile(file);
    setPreviewUrl(objectUrl);

    // Open the confirmation modal
    setModalOpen(true);

    // Clear the file input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleModalClose = () => {
    // Close the modal and clean up the preview URL
    setModalOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  };

  const handleUploadConfirm = async () => {
    if (!selectedFile) return;

    try {
      // Your firebase upload logic here
      const downloadURL = await uploadUserAvatar(user.id, selectedFile);
      await updateUserAvatarURL(user.id, downloadURL);

      console.log("Image upload confirmed for:", selectedFile.name);

      // Close the modal after successful upload
      handleModalClose();
    } catch (error) {
      console.error("Error uploading image:", error);
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
        <MenuItem onClick={handleMenuClose}>Remove photo</MenuItem>
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
        open={modalOpen}
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
            >
               Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUploadConfirm}
              color="primary"
            >Update Profile Photo
            </Button>
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
