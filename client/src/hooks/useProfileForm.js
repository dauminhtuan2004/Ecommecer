import { useState } from 'react';
import toast from 'react-hot-toast';

export const useProfileForm = (initialUser, updateProfile) => {
  const [profileForm, setProfileForm] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(profileForm);
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  return {
    profileForm,
    setProfileForm,
    loading,
    handleProfileUpdate,
  };
};

export const useAddressForm = (loadAddresses) => {
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam',
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Vietnam',
    });
    setEditingAddress(null);
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm(address);
    } else {
      resetAddressForm();
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    resetAddressForm();
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAddress) {
        // TODO: Update address API
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        // TODO: Create address API
        toast.success('Thêm địa chỉ thành công');
      }
      closeAddressModal();
      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Bạn có chắc muốn xóa địa chỉ này?')) return;
    
    try {
      // TODO: Delete address API
      toast.success('Xóa địa chỉ thành công');
      loadAddresses();
    } catch (error) {
      toast.error('Không thể xóa địa chỉ');
    }
  };

  return {
    addressForm,
    setAddressForm,
    showAddressModal,
    editingAddress,
    loading,
    openAddressModal,
    closeAddressModal,
    handleAddressSubmit,
    handleDeleteAddress,
  };
};
