# INF2003-Project

## Introduction:
With the easing of COVID-19 travel restrictions in Japan, Kyoto has regained its position as a top tourist destination. However, travelers currently face the challenge of independently researching and finding recommended restaurants near their accommodations. There is a noticeable absence of applications that seamlessly combine hotel bookings and restaurant recommendations in Kyoto.

To address this issue, we propose the creation of a comprehensive web application dedicated to booking and reviewing hotels and restaurants in Kyoto. Our goal is to offer travelers an up-to-date one-stop solution for all their lodging and dining needs, offering maximum convenience.

## Objectives:
Our web application project aims to fulfill the pressing need for a convenient travel planning tool in Kyoto. We prioritize the convenience of travelers by streamlining the process of arranging accommodations and dining experiences.

Our primary goal is to save tourists time, as we understand that researching and reserving hotels and restaurants may be time-consuming and overwhelming. We hope to simplify trip planning by combining various services into a single user-friendly website, allowing passengers to plan their vacations more effectively and spend more time discovering and relaxing.

Beyond convenience, our vision is to elevate the overall travel experience in Kyoto. We go beyond mere reservations and offer valuable insights and recommendations from locals and experienced travelers. Our platform empowers users to make informed choices, uncover hidden gems, and fully immerse themselves in Kyoto's rich culture and cuisine.

## Database Setup
1. MySQL
2. MongoDB   

## Following Steps
1. **Download the Repository:**
   - Click the "Code" button and select "Download ZIP."
   - Extract the downloaded ZIP archive to your desired location on your computer.

2. **Download the Latest Node.js LTS:**
   - [Link to download here](https://nodejs.org/en/download).

3. **Open a Terminal:**
   - Navigate to the extracted repository folder.
   - Open a terminal, command prompt, or Visual Studio Code terminal in the extracted repository folder.
   
4. **Install Dependencies:**
   - Run the following command to install dependencies:
      > Type "npm install" on the terminal
  
5. Running the Application
   - Execute the following command in the terminal:
      > Type "npm run dev" on the terminal

6. **Verify Console Logs:**
   - Make sure to always this 3 console logs in the terminal (in any order)
      - Node.js App is running on port 3001
      - Connected to MongoDB Server
      - SSH tunnel to MySQL server established

7. Usage:
   - Open your web browser and navigate to [http://localhost:3001](http://localhost:3001).
   - Follow the on-screen instructions to interact with the application.

8. **Handling Errors:**
   - If you encounter any errors in the webpage or terminal:
     - Press 'Ctrl-c' in the terminal and type 'y'.
     - You will see the result:
      - Server closing...
      - All connections in the pool have been released.
   - Now once the application has stopped running, please proceed to step 5 and run the application again.

9. **Note on "Warning: got packets out of order":**
   - Don't worry if you see this warning/error in the terminal. It's a known issue with the node-mysql2 library:
     - [Issue #653](https://github.com/sidorares/node-mysql2/issues/653)
     - [Issue #1334](https://github.com/sidorares/node-mysql2/issues/1334)
   - To bypass this error, please proceed to step 5 and run the application again
