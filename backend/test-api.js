// Simple API test script
const http = require('http');

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: body
        });
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing /health endpoint...');
    const health = await makeRequest('/health');
    console.log(`   Status: ${health.statusCode}`);
    console.log(`   Response: ${health.body}\n`);

    // Test 2: Register endpoint
    console.log('2️⃣  Testing POST /api/auth/register...');
    const userData = {
      email: `user-${Date.now()}@example.com`,
      password: 'Test123456',
      fullName: 'Test User',
      phoneNumber: '1234567890'
    };
    const register = await makeRequest('/api/auth/register', 'POST', userData);
    console.log(`   Status: ${register.statusCode}`);
    console.log(`   Response: ${register.body}\n`);

    // Test 3: 404 handler
    console.log('3️⃣  Testing 404 handler...');
    const notFound = await makeRequest('/api/nonexistent');
    console.log(`   Status: ${notFound.statusCode}`);
    console.log(`   Response: ${notFound.body}\n`);

    console.log('✅ All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Wait a bit for server to be ready
setTimeout(runTests, 1000);
