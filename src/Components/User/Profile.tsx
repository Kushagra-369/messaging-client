'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload, Save, Edit2, User, Mail, Hash, VenusAndMars, FileText, CheckCircle, Shield } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

// ProfileImageUpload Component
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
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
          {previewUrl || currentImage.secure_url ? (
            <img
              src={previewUrl || currentImage.secure_url}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-4xl text-indigo-600 font-semibold">
                K
              </span>
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200"
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
          className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors duration-200 flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Change Photo</span>
        </button>
        
        {(previewUrl || currentImage.secure_url) && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="px-4 py-2 bg-red-50 border border-red-600 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Remove</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ProfileForm Component
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-2">View and manage your profile information</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit2 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {profile.profileImg.secure_url ? (
                        <img
                          src={profile.profileImg.secure_url}
                          alt={profile.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                          <span className="text-3xl text-indigo-600 font-semibold">
                            {profile.first_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {profile.first_name} {profile.last_name}
                      </h2>
                      <p className="text-gray-600">@{profile.username}</p>
                      
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-600">
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
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-700">Name</h3>
                      </div>
                      <p className="text-lg text-gray-900">{profile.first_name} {profile.last_name}</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <Hash className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-700">Username</h3>
                      </div>
                      <p className="text-lg text-gray-900">@{profile.username}</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <Mail className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-700">Email</h3>
                      </div>
                      <p className="text-lg text-gray-900">{profile.email}</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <VenusAndMars className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-700">Gender</h3>
                      </div>
                      <p className="text-lg text-gray-900">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-semibold text-gray-700">Bio</h3>
                    </div>
                    <p className="text-gray-900">{profile.bio || 'No bio added yet.'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                    <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">Member Since</h4>
                      <p className="text-gray-900">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-linear-to-r from-green-50 to-emerald-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">Last Updated</h4>
                      <p className="text-gray-900">{new Date(profile.updatedAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="bg-linear-to-r from-purple-50 to-pink-50 p-5 rounded-xl">
                      <h4 className="font-semibold text-gray-700 mb-2">Last Seen</h4>
                      <p className="text-gray-900">{new Date(profile.lastSeen).toLocaleDateString()}</p>
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
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-2">Update your profile information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
                  <ProfileImageUpload
                    currentImage={profile.profileImg}
                    onImageChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  // Mock profile data
  const [profile, setProfile] = useState<UserProfile>({
    _id: '696748a0dcc8b5204bd45019',
    username: 'kushagra100chhabra',
    first_name: 'Kushagra',
    last_name: 'Chhabra',
    email: 'kushagrachhabra@gmail.com',
    profileImg: {
      public_id: '',
      secure_url: '',
    },
    gender: '',
    bio: '',
    isOnline: true,
    status: 'offline',
    lastSeen: '2026-01-14T07:41:43.968+00:00',
    createdAt: '2026-01-14T07:41:20.505+00:00',
    updatedAt: '2026-01-14T07:41:43.968+00:00',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: ProfileFormData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update profile with new data
      setProfile(prev => ({
        ...prev,
        ...formData,
        profileImg: formData.profileImage 
          ? {
              public_id: 'new_image_id',
              secure_url: URL.createObjectURL(formData.profileImage),
            }
          : prev.profileImg,
        updatedAt: new Date().toISOString(),
      }));
      
      // Show success toast
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
    } catch (error) {
      // Show error toast
      toast.error('Failed to update profile. Please try again.', {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 py-8">
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-sans',
        }}
      />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your personal information, profile picture, and account settings
          </p>
        </div>

        {/* Profile Form */}
        <ProfileForm 
          profile={profile}
          onSave={handleSave}
          isSaving={isSaving}
        />

        {/* Account Information Section */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-700 mb-2">Account Status</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-blue-900">{profile.isOnline ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-purple-700 mb-2">User Role</h4>
                <p className="text-purple-900">Standard User</p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-xl">
                <h4 className="font-semibold text-emerald-700 mb-2">Account ID</h4>
                <p className="text-emerald-900 font-mono text-sm truncate" title={profile._id}>
                  {profile._id.substring(0, 12)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">0</div>
                <div className="text-sm text-gray-600">Contacts</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">0</div>
                <div className="text-sm text-gray-600">Blocked Users</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">100%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">0</div>
                <div className="text-sm text-gray-600">Unread Messages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(profile.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}