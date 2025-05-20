import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, CircularProgress, Button } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Collapse } from 'react-collapse';
import AccountSidebar from '../../components/AccountSidebar';
import { MyContext } from '../../App';
import { postData, editData } from '../../utils/api';

const MyAccount = () => {
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) navigate('/');
  }, [context?.isLogin]);

  useEffect(() => {
    if (context?.userData?._id) {
      const { _id, name, email, mobile } = context.userData;

      setUserId(_id);
      setProfile({ name: name || '', email: email || '', mobile: mobile || '' });
      
      // Convert mobile to E.164 string format if needed
      let formattedMobile = '';
      if (mobile) {
        const mobileStr = mobile.toString();
        formattedMobile = mobileStr.startsWith('+') ? mobileStr : `+${mobileStr}`;
      }
      setPhone(formattedMobile);

      setPasswordForm(prev => ({ ...prev, email: email || '' }));
    }
  }, [context?.userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (profile.hasOwnProperty(name)) {
      setProfile(prev => ({ ...prev, [name]: value }));
    }

    if (passwordForm.hasOwnProperty(name)) {
      setPasswordForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const isProfileValid = Object.values(profile).every(value => {
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return Boolean(value);
  });

  const updateProfile = async (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);

    const { name, email, mobile } = profile;

    if (!name || !email || !mobile) {
      context?.alertBox('error', 'Please fill in all required fields');
      setIsProfileUpdating(false);
      return;
    }

    try {
      const res = await editData(`/api/user/${userId}`, profile, { withCredentials: true });

      if (res?.error !== true) {
        context?.alertBox('success', res?.data?.message || 'Profile updated');
      } else {
        context?.alertBox('error', res?.data?.message || 'Update failed');
      }
    } catch {
      context?.alertBox('error', 'Something went wrong');
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setIsPasswordUpdating(true);

    const { oldPassword, newPassword, confirmPassword } = passwordForm;

    if (!newPassword || !confirmPassword || (!context?.userData?.signUpWithGoogle && !oldPassword)) {
      context?.alertBox('error', 'Please fill all password fields');
      setIsPasswordUpdating(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      context?.alertBox('error', 'Password and Confirm Password do not match');
      setIsPasswordUpdating(false);
      return;
    }

    try {
      const res = await postData('/api/user/reset-password', passwordForm, { withCredentials: true });

      if (res?.error !== true) {
        context?.alertBox('success', res?.message || 'Password changed');
        setPasswordForm(prev => ({
          ...prev,
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordForm(false);
      } else {
        context?.alertBox('error', res?.message || 'Password change failed');
      }
    } catch {
      context?.alertBox('error', 'Something went wrong');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  return (
    <section className="py-3 lg:py-10 w-full">
      <div className="container flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-[20%]">
          <AccountSidebar />
        </div>

        <div className="w-full lg:w-[50%]">
          <div className="card bg-white p-5 shadow-md rounded-md mb-5">
            <div className="flex items-center pb-3">
              <h2 className="text-lg font-semibold">My Profile</h2>
              <Button className="!ml-auto" onClick={() => setShowPasswordForm(prev => !prev)}>
                Change Password
              </Button>
            </div>
            <hr />

            <form className="mt-8" onSubmit={updateProfile}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  label="Full Name"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="name"
                  value={profile.name}
                  disabled={isProfileUpdating}
                  onChange={handleInputChange}
                />

                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  size="small"
                  className="w-full"
                  name="email"
                  value={profile.email}
                  disabled
                />

                <PhoneInput
                  defaultCountry="IN"
                  value={phone}
                  disabled={isProfileUpdating}
                  onChange={(value) => {
                    setPhone(value || ''); // fallback to empty string
                    setProfile(prev => ({ ...prev, mobile: value || '' }));
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-4 mt-6">
                <Button
                  type="submit"
                  disabled={!isProfileValid}
                  className="btn-org btn-sm w-[150px]"
                >
                  {isProfileUpdating ? <CircularProgress size={20} color="inherit" /> : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>

          <Collapse isOpened={showPasswordForm}>
            <div className="card bg-white p-5 shadow-md rounded-md">
              <h2 className="pb-3 text-lg font-semibold">Change Password</h2>
              <hr />

              <form className="mt-8" onSubmit={updatePassword}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {!context?.userData?.signUpWithGoogle && (
                    <TextField
                      label="Old Password"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="oldPassword"
                      type="password"
                      value={passwordForm.oldPassword}
                      disabled={isPasswordUpdating}
                      onChange={handleInputChange}
                    />
                  )}

                  <TextField
                    type="password"
                    label="New Password"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    disabled={isPasswordUpdating}
                    onChange={handleInputChange}
                  />

                  <TextField
                    label="Confirm Password"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    disabled={isPasswordUpdating}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <Button type="submit" className="btn-org btn-sm w-[200px]">
                    {isPasswordUpdating ? <CircularProgress size={20} color="inherit" /> : 'Change Password'}
                  </Button>
                </div>
              </form>
            </div>
          </Collapse>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
