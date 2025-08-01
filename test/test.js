const request = require('supertest');
const app = require('../server');
const path = require('path');
const fs = require('fs');

// Test health endpoint
describe('Health Check', () => {
  test('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

// Test single file upload
describe('Single File Upload', () => {
  test('POST /api/upload/single should upload a file', async () => {
    // Create a test file
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file');

    const response = await request(app)
      .post('/api/upload/single')
      .attach('file', testFilePath);

    // Clean up test file
    fs.unlinkSync(testFilePath);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('url');
  });

  test('POST /api/upload/single should return 400 for no file', async () => {
    const response = await request(app)
      .post('/api/upload/single');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

// Test multiple files upload
describe('Multiple Files Upload', () => {
  test('POST /api/upload/multiple should upload multiple files', async () => {
    // Create test files
    const testFile1 = path.join(__dirname, 'test-file1.txt');
    const testFile2 = path.join(__dirname, 'test-file2.txt');
    fs.writeFileSync(testFile1, 'Test file 1');
    fs.writeFileSync(testFile2, 'Test file 2');

    const response = await request(app)
      .post('/api/upload/multiple')
      .attach('files', testFile1)
      .attach('files', testFile2);

    // Clean up test files
    fs.unlinkSync(testFile1);
    fs.unlinkSync(testFile2);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });
});

// Test multifield upload
describe('Multifield Upload', () => {
  test('POST /api/upload/multifield should upload files to different fields', async () => {
    // Create test files
    const testImage = path.join(__dirname, 'test-image.txt');
    const testDoc = path.join(__dirname, 'test-doc.txt');
    fs.writeFileSync(testImage, 'Test image content');
    fs.writeFileSync(testDoc, 'Test document content');

    const response = await request(app)
      .post('/api/upload/multifield')
      .attach('images', testImage)
      .attach('documents', testDoc);

    // Clean up test files
    fs.unlinkSync(testImage);
    fs.unlinkSync(testDoc);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('images');
    expect(response.body.data).toHaveProperty('documents');
  });
}); 