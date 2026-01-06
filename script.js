document.addEventListener('DOMContentLoaded', () => {
    // Select all parking spots. Make sure this selector matches your HTML.
    // Based on your HTML, the IDs are A1, A2, etc., and they have class 'parkingbox-style'.
    const parkingSpots = document.querySelectorAll('.parkingbox-style');
    const totalSpotsElement = document.getElementById('totalSpots');
    const availableSpotsElement = document.getElementById('availableSpots'); // This is for 'free'
    const occupiedSpotsElement = document.getElementById('occupiedSpots');   // This is for 'full'

    // --- Firebase Configuration and Initialization (from your HTML) ---
        const firebaseConfig = {
            apiKey: "AIzaSyCWxwvq5Ye495jr3D9Dnf5QODrFy0uvF8E",
            authDomain: "slot-logo-16102025.firebaseapp.com",
            databaseURL: "https://slot-logo-16102025-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "slot-logo-16102025",
            storageBucket: "slot-logo-16102025.firebasestorage.app",
            messagingSenderId: "618362914173",
            appId: "1:618362914173:web:75ea95e194430bf60a3814"
        };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const parkingRef = database.ref('parking/slot');
    // --- End Firebase Config ---

    // Function to update the status counts based on current HTML classes
    function updateParkingStatus() {
        const total = parkingSpots.length;
        let freeCount = 0;
        let fullCount = 0;

        parkingSpots.forEach(spot => {
            if (spot.classList.contains('free')) {
                freeCount++;
            } else if (spot.classList.contains('full')) {
                fullCount++;
            }
        });

        totalSpotsElement.textContent = total;
        availableSpotsElement.textContent = freeCount;
        occupiedSpotsElement.textContent = fullCount;
    }

    // Listen for changes in Firebase
    parkingRef.on('value', (snapshot) => {
        const slotsData = snapshot.val(); // Get all slot data from Firebase

        if (slotsData) {
            // Loop through each parking spot element in your HTML
            parkingSpots.forEach(element => {
                const slotId = element.id; // Get the ID of the parking spot (e.g., 'A1', 'A2')

                // Check if this slotId exists in the Firebase data
                if (slotsData[slotId]) {
                    const status = slotsData[slotId]; // Get status (e.g., 'free' or 'full')

                    // Update the HTML element's classes based on Firebase status
                    if (status === 'free') {
                        element.classList.remove('full');
                        element.classList.add('free');
                    } else if (status === 'full') {
                        element.classList.remove('free');
                        element.classList.add('full');
                    }
                    // You might also want to set the text content if it's dynamic
                    // element.textContent = slotId; // Or whatever dynamic text you want
                }
            });
        }
        // IMPORTANT: Call updateParkingStatus AFTER all HTML elements have been updated by Firebase data
        updateParkingStatus();
    });
});
