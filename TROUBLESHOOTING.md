# Troubleshooting Google Books API 404 Error

## Issue: Request failed with status code 404

This usually happens when the backend server hasn't been restarted after adding new routes.

## Solution:

1. **Stop your backend server** (if it's running):
   - Press `Ctrl + C` in the terminal where the server is running

2. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

3. **Restart the backend server**:
   ```bash
   npm start
   ```
   OR if you're using nodemon:
   ```bash
   npm run dev
   ```

4. **Verify the server is running**:
   - You should see: "Server running on port 5000"
   - Check: http://localhost:5000/api/google-books (should not return 404)

5. **If still getting 404, check**:
   - Is the backend server running on port 5000?
   - Are there any errors in the backend console?
   - Is axios installed? Run: `npm install axios` in the backend directory

## Routes Available:
- `GET /api/google-books` - Get all books (browse)
- `GET /api/google-books/search?q=query` - Search books
- `GET /api/google-books/details/:id` - Get book details

