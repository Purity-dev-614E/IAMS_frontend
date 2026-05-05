// Test script to verify refresh token functionality
// This can be run in the browser console to test the implementation

import { apiClient, tokenStorage } from '../apis';

export const testRefreshToken = async () => {
  console.log('🧪 Testing refresh token implementation...');
  
  // Test 1: Check token storage functions
  console.log('\n📋 Test 1: Token Storage');
  const testToken = 'test-access-token';
  const testRefreshToken = 'test-refresh-token';
  
  tokenStorage.setTokens(testToken, testRefreshToken);
  console.log('✅ Token storage set');
  
  const retrievedToken = tokenStorage.getAccessToken();
  const retrievedRefreshToken = tokenStorage.getRefreshToken();
  
  console.log('Retrieved access token:', retrievedToken === testToken ? '✅' : '❌');
  console.log('Retrieved refresh token:', retrievedRefreshToken === testRefreshToken ? '✅' : '❌');
  
  // Test 2: Clear tokens
  tokenStorage.clearTokens();
  console.log('Tokens cleared:', !tokenStorage.getAccessToken() && !tokenStorage.getRefreshToken() ? '✅' : '❌');
  
  // Test 3: Simulate API call with expired token (if user is logged in)
  console.log('\n📋 Test 2: API Call with Token Refresh');
  const currentToken = tokenStorage.getAccessToken();
  const currentRefreshToken = tokenStorage.getRefreshToken();
  
  if (currentToken && currentRefreshToken) {
    console.log('🔐 User is logged in, testing API call...');
    
    try {
      // Make an API call that should trigger refresh if token is expired
      const response = await apiClient.get('/auth/me');
      console.log('✅ API call successful, user data:', response.user ? '✅' : '❌');
    } catch (error) {
      if (error.message.includes('Session expired')) {
        console.log('⚠️ Token refresh failed, user redirected to login (expected behavior)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
  } else {
    console.log('ℹ️ No active session - login to test API calls');
  }
  
  console.log('\n🎉 Refresh token implementation test completed!');
  console.log('\n📝 Manual Testing Instructions:');
  console.log('1. Login to the application');
  console.log('2. Wait 15 minutes for access token to expire');
  console.log('3. Make any API call (should auto-refresh)');
  console.log('4. Check browser network tab for refresh-token call');
  console.log('5. Verify user stays logged in and API call succeeds');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testRefreshToken = testRefreshToken;
  console.log('💡 Run testRefreshToken() in console to test refresh token functionality');
}
