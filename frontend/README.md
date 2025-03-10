# **Thinker App**

Thinker App is a smart app designed to help users organize and create thoughts, ideas, and learning. The app allows users to add and organize content intuitively, with support for advanced features and integration with external services.

## Installation Instructions
To install and run the project, follow the steps below. These instructions cover installation from scratch, including setting up Node.js and Expo, even for users who don't have React Native or other tools installed.

### 1. Install Prerequisites
Before starting, ensure you have the following tools installed:

Node.js: Download and install Node.js. Make sure to install the LTS version (14 or higher).
Expo CLI: Expo is a framework for React Native. Install Expo globally by running the following command in your terminal or command prompt:
```bash
npm install -g expo-cli
```
### 2. Clone the Project
Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/thinker-app.git
cd thinker-app
```
### 3. Install Dependencies
In your project folder, install the required dependencies by running:

```bash
npm install
```
This will install all the necessary packages listed in the package.json file, including Expo and React Native dependencies.

### 4. Start the Project
After the installation is complete, you can start the app.
To run the app
```bash
npx expo start
```

For Android: To run the app on an Android device or emulator press a


For Web: To run the app in a web browser press w


Once the app starts, Expo will open a browser window, and you will see the app running. You can also scan the QR code using the Expo Go app on your phone.

### 5. Linting the Code
To lint the codebase and ensure code quality, use the following command:

```bash
npm run lint
```
This will check for any coding issues based on the configuration defined in the project.

System Requirements
Node.js (version 14 or higher)
Expo (version 52.0.26)
React Native (version 0.76.6)
If you're unsure about your current versions of Node.js or Expo, you can check them by running:

```bash
node -v
expo --version
```