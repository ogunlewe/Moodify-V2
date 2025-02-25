# Moodify: Your Personalized Music Experience

Moodify is a web application designed to enhance your music listening experience by tailoring song recommendations to your current mood. Discover new music, create playlists, follow artists, and share your favorite tunes with friends.

## Features

*   **Mood-Based Recommendations:** Get personalized song suggestions based on your selected mood.
*   **Song Uploads:** Upload your own music and share it with the Moodify community.
*   **User Authentication:** Securely log in and register using Firebase Authentication.
*   **Playlist Creation:** Create and manage custom playlists.
*   **User Profiles:** Follow other users and view their profiles.
*   **Music Player Widget:** Enjoy a seamless music playback experience with mini and full player modes.
*   **Like and Comment:** Interact with songs by liking them and leaving comments.

## Technologies Used

*   **React:** Front-end framework for building the user interface.
*   **TypeScript:** Language for enhanced code maintainability and scalability.
*   **Firebase:** Back-end platform for authentication, database, and storage.
*   **React Router:** Navigation and routing within the application.
*   **Axios:** HTTP client for making API requests.
*   **Cloudinary:** Cloud service for storing and delivering uploaded media files
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **Lucide React:** Beautifully simple icons.

## Installation

Follow these steps to set up Moodify on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    cd moodify
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Firebase:**

    *   Create a Firebase project on the [Firebase Console](https://console.firebase.google.com/).
    *   Enable Authentication (Email/Password).
    *   Create a Firestore database.
    *   Create a Storage bucket.
    *   Copy the Firebase configuration object and replace the placeholder in `src/firebaseConfig.ts`.

4.  **Configure Cloudinary:**

    *   Create a Cloudinary account on [Cloudinary Website](https://cloudinary.com/).
    *   Get your Cloud Name, API Key, and API Secret.
    *   Set an upload preset, or create a new one with mode set to `unsigned`

5.  **Environment Variables:**

    *While this project doesn't explicitly use `.env` files for environment variables other than the Firebase Config, it's good practice to store sensitive information and configuration settings in environment variables for security and ease of configuration in different environments.*

6.  **Start the development server:**

    ```bash
    npm start
    ```

    Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

1.  **Register or log in:** Use your email and password to create a new account or log in to an existing one.
2.  **Explore the Home page:** Discover a selection of featured songs.
3.  **Upload Music:** Upload your own songs using the Upload page.
4.  **Browse Songs:** Discover all the available songs in the Song page
5.  **Search for music:** Use the search bar to find specific songs or artists.
6.  **Create playlists:** Manage and create custom playlists with the Playlists page.
7.  **View profiles:** View the profiles of other users.

## Contributing

We welcome contributions from the community! To contribute to Moodify:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Submit a pull request.

## Code Style

*   Follow the existing code style in the project.
*   Write clear, concise, and well-documented code.
*   Use meaningful variable and function names.

## License

This project is open-source and available under the [MIT License](LICENSE).

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
