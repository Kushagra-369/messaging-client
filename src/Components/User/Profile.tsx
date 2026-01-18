'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Save, Edit2, User, Mail, Hash, VenusAndMars, FileText, CheckCircle, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { APIURL } from "../../GlobalAPIURL";

// Types
interface ProfileImage {
  public_id: string;
  secure_url: string;
}

interface UserProfile {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profileImg: ProfileImage;
  gender: string;
  bio: string;
  isOnline: boolean;
  status: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  role?: string;
}

interface ProfileFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  bio: string;
  profileImage?: File;
}

// ProfileImageUpload Component Props
interface ProfileImageUploadProps {
  currentImage: ProfileImage;
  onImageChange: (file: File | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ currentImage, onImageChange }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
          {previewUrl || currentImage.secure_url ? (
            <img
              src={previewUrl || currentImage.secure_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <span className="text-4xl text-indigo-600 dark:text-indigo-300 font-semibold">
                {currentImage.secure_url ? '' : 'U'}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Change Photo</span>
        </button>

        {(previewUrl || currentImage.secure_url) && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ProfileForm Component Props
interface ProfileFormProps {
  profile: UserProfile;
  onSave: (data: ProfileFormData) => void;
  isSaving?: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, isSaving = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: profile.username,
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    gender: profile.gender,
    bio: profile.bio,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ProfileFormData = {
      ...formData,
      ...(profileImage && { profileImage }),
    };
    onSave(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: profile.username,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      gender: profile.gender,
      bio: profile.bio,
    });
    setProfileImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (file: File | null) => {
    setProfileImage(file);
  };

  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/20 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your profile information</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit2 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-indigo-100 dark:border-gray-700">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                      {profile.profileImg?.secure_url ? (
                        <img
                          src={profile.profileImg.secure_url}
                          alt={profile.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center">
                          <span className="text-3xl text-indigo-600 dark:text-indigo-300 font-semibold">
                            {profile.first_name?.charAt(0)?.toUpperCase() || profile.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile.first_name} {profile.last_name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>

                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {profile.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Name</h3>
                      </div>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {profile.first_name && profile.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Not set'
                        }
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Username</h3>
                      </div>
                      <p className="text-lg text-gray-900 dark:text-white">@{profile.username}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800  p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Email</h3>
                      </div>
                      <p
                        className="text-lg text-gray-900 dark:text-white break-all"
                        title={profile.email}
                      >
                        {profile.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <VenusAndMars className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">Gender</h3>
                      </div>
                      <p className="text-lg text-gray-900 dark:text-white">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">Bio</h3>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100">{profile.bio || 'No bio added yet.'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Member Since</h4>
                      <p className="text-gray-900 dark:text-gray-100">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Updated</h4>
                      <p className="text-gray-900 dark:text-gray-100">{new Date(profile.updatedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Seen</h4>
                      <p className="text-gray-900 dark:text-gray-100">{new Date(profile.lastSeen).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/20 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Update your profile information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl border border-indigo-100 dark:border-gray-700">
                  <ProfileImageUpload
                    currentImage={profile.profileImg || { public_id: '', secure_url: '' }}
                    onImageChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200"
                      >
                        <option value="" className="bg-white dark:bg-gray-800">Select Gender</option>
                        <option value="male" className="bg-white dark:bg-gray-800">Male</option>
                        <option value="female" className="bg-white dark:bg-gray-800">Female</option>
                        <option value="other" className="bg-white dark:bg-gray-800">Other</option>
                        <option value="prefer-not-to-say" className="bg-white dark:bg-gray-800">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Profile Page Component
export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        toast.error('Please login to view profile');
        navigate('/login');
        return;
      }

      console.log('Fetching user info from auth_me...');

      // Step 1: Get user ID from auth_me
      const authResponse = await fetch(`${APIURL}/auth_me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (authResponse.status === 401) {
        localStorage.removeItem('access_token');
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const authResult = await authResponse.json();

      if (!authResponse.ok || !authResult.success || !authResult.user) {
        throw new Error(authResult.message || 'Failed to authenticate');
      }

      const userId = authResult.user.id;
      console.log('Got user ID:', userId);

      // Step 2: Get full user data using get_user_by_id
      const userResponse = await fetch(`${APIURL}/get_user_by_id/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const userResult = await userResponse.json();

      if (!userResponse.ok || !userResult.success) {
        throw new Error(userResult.message || 'Failed to fetch user data');
      }

      const userData = userResult.user || userResult.data;

      if (!userData) {
        throw new Error('No user data received');
      }

      console.log('Full user data:', userData);

      // Map the backend data to frontend UserProfile type
      const userProfile: UserProfile = {
        _id: userData._id || userId,
        username: userData.username || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || authResult.user.email,
        profileImg: {
          public_id: userData.profileImg?.public_id || '',
          secure_url: userData.profileImg?.secure_url || '',
        },
        gender: userData.gender || '',
        bio: userData.bio || '',
        isOnline: userData.isOnline || false,
        status: userData.status || 'offline',
        lastSeen: userData.lastSeen || new Date().toISOString(),
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
        role: userData.role || 'user'
      };

      setProfile(userProfile);
      console.log('Profile set successfully:', userProfile);

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error(error.message || 'Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData: ProfileFormData) => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        toast.error('Please login to update profile');
        navigate('/login');
        return;
      }

      if (!profile?._id) {
        toast.error('User ID not found');
        return;
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('bio', formData.bio);

      if (formData.profileImage) {
        formDataToSend.append('profile_picture', formData.profileImage);
      }

      console.log('Updating profile...');

      const response = await fetch(
        `${APIURL}/user_profile_update/${profile._id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );


      const responseText = await response.text();
      console.log('Update response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!', {
        duration: 4000,
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        style: {
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          padding: '16px',
          color: '#0c4a6e',
        },
      });

      // Refresh profile data from backend
      fetchProfile();

    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile. Please try again.', {
        duration: 4000,
        style: {
          background: '#fef2f2',
          border: '1px solid #fecaca',
          padding: '16px',
          color: '#7f1d1d',
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

 

  const handleBackToHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans',
        }}
      />

      <div className="container mx-auto px-4">
        {/* Header with Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Your Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Manage your personal information, profile picture, and account settings
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <button
                onClick={handleBackToHome}
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
              >
                Back to Home
              </button>

            
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm
          profile={profile}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* Account Information Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/20 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Account Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Account Status</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-blue-900 dark:text-blue-200">{profile.isOnline ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">User Role</h4>
                <p className="text-purple-900 dark:text-purple-200">{profile.role || 'Standard User'}</p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Account ID</h4>
                <p className="text-emerald-900 dark:text-emerald-200 font-mono text-sm truncate" title={profile._id}>
                  {profile._id.substring(0, 12)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-800/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {new Date(profile.lastSeen).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Last Active</div>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {profile.status}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
              </div>
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {profile.gender || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Gender</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date(profile.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}