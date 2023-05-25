async function getCurrentDateTime() {
    const currentDateTimeStamp = new Date()
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    };

    let currentDate = currentDateTimeStamp.getDate() // Get the current date
    let currentHour = currentDateTimeStamp.getHours()
    const currentMinute = currentDateTimeStamp.getMinutes().toString().padStart(2, '0')


    if ((currentHour < 3) || (currentHour === 3 && currentMinute < 45)) {
        // If the current time is before 3:30 AM, subtract one day from the current date
        currentDate -= 1;

        // Create a new Date object with the modified date
        const modifiedDate = new Date();
        modifiedDate.setDate(currentDate);
        const yesterdaysDate = modifiedDate.toLocaleString('en-US', options);

        let period = 'AM';

        if (currentHour === 0) {
            currentHour = 12
        } else if (currentHour > 12) {
            currentHour %= 12
            period = 'PM'
        }

        const currentTime = `${currentHour}:${currentMinute}${period}`
        
        return { todaysDate: yesterdaysDate, currentTime }
    } else {
        let period = 'AM';

        if (currentHour === 0) {
            currentHour = 12
        } else if (currentHour > 12) {
            currentHour %= 12
            period = 'PM'
        }

        const currentTime = `${currentHour}:${currentMinute}${period}`

        return { todaysDate: currentDateTimeStamp.toLocaleString('en-US', options), currentTime }
    }
}

module.exports = { getCurrentDateTime };