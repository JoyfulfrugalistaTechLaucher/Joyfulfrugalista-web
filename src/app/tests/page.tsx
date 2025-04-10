"use client";

import React from 'react';
import Animation from '../components/Animation';
import { useAuth } from '../contexts/AuthContext';

const TestPage: React.FC = () => {
    const { uid } = useAuth();
    // const uid = "3DNh7orraCdeYJvXtRHCE425dYr1";
    return (
        <div>
            {uid && <Animation uid={uid} />}
        </div>
    );
};
export default TestPage;
