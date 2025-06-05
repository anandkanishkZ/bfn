// Debug utility to check authentication state
export const debugAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user'));
    
    console.log('Auth Debug:');
    console.log('Token exists:', !!token);
    console.log('Role:', role);
    console.log('User:', user);
    console.log('Is admin:', user?.role === 'admin');
    
    return {
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin',
      user
    };
  } catch (err) {
    console.error('Error debugging auth:', err);
    return { isAuthenticated: false, isAdmin: false, user: null };
  }
};
