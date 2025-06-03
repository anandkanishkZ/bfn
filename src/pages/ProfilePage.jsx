import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const ProfilePage = () => {
    const [profile, setProfile] = useState({ name: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });    useEffect(() => {
        // Fetch user profile on component mount
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                setProfile(response.data);
                setFormData({ name: response.data.name, email: response.data.email });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };    const handleSave = async () => {
        try {
            await axios.put('/api/profile', formData);
            setProfile(formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            {isEditing ? (
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
