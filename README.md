# Notion Proofread App 📝

A powerful tool that integrates with Notion to help users revise their English writing. This application allows users to input their diary entries, receive AI-driven proofreading, and save the results directly to Notion.

## Features ✨

- **AI-Powered Proofreading**: Receive advanced English proofreading tailored to your preferred writing style and error level.
- **Customizable Error Detection**: Choose specific error types like grammar, vocabulary, and usage.
- **Auto-Save Drafts**: Automatically save your draft entries locally while writing.
- **Save to Notion**: Seamlessly save your revised entries to your Notion workspace.
- **Intuitive UI**: User-friendly interface with real-time feedback and error handling.

## Tech Stack 🛠️

- **Frontend**: React, Next.js
- **Form Management**: React Hook Form, Zod
- **Styling**: TailwindCSS, shadcn
- **Notifications**: Sonner for toast notifications
- **Markdown Rendering**: React Markdown with GFM (GitHub Flavored Markdown)

## Setup 🚀

Follow these steps to run the application locally:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/notion-summarize.git
   cd notion-summarize

   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a .env.local file and add your environment variables:

   ```
   NOTION_API_KEY=your_notion_api_key
   NOTION_DATABASE_ID=your_notion_database_id
   GEMINI_API_KEY=your_gemini_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```
5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Usage 🖥️

Step 1: Write Your Entry

- Open the app and write your diary entry in English in the text area provided.
- The entry must be at least 10 characters long.

Step 2: Customize Proofreading

- Select your writing style (Casual, Formal, Normal).
- Choose your desired error level (Basic, Intermediate, Advanced).
- Specify the types of errors you want the AI to focus on (Grammar, Vocabulary, Usage).

Step 3: Submit for Proofreading

- Click the “添削する” button to submit your entry.
- The AI will process the entry and return a revised version.

Step 4: Save to Notion

- Review the revised text.
- Click the “Notion に保存する” button to save the proofread entry to your connected Notion database.

## API Endpoints 🌐

1. POST /api/proofread

- Input: Diary entry, writing style, error level, error types.
- Output: Proofread text. 2. POST /api/save-to-notion
- Input: Original text, proofread text, writing style.
- Output: Confirmation of successful save to Notion.

## Known Issues 🐞

- Long entries might take additional time to process.
- Ensure that your Notion API key and database ID are correctly configured in the .env.local file.

## License 📜

This project is licensed under the MIT License.

Feel free to modify and expand upon this template to suit your project’s specific needs!
