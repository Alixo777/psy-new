const meetingData = {
    patientId: "", // get from mongo ObjectID
    tcode: "", // get from therapist collection
    startDate: "",
    meetNum: 0,
    DepressionExam: "",
    PanicExam : "",
    SelfConfidenceExam : "",
    SocialPanicExam : "",
    StressExam : "" // get from exams collection
  };

  document.addEventListener('DOMContentLoaded', async () => {
    let step = 2;
    let selectedTherapist = null;
    let selectedDate = null;
    let selectedTime = null;

    const dates = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });

    const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const updateProgressIndicator = () => {
      document.querySelectorAll('.step-active').forEach(el => el.classList.remove('step-active'));
      document.querySelectorAll('.step-inactive').forEach(el => el.classList.remove('step-inactive'));
      for (let i = 2; i <= 4; i++) {
        const indicator = document.getElementById(`step-${i}-indicator`);
        if (i <= step) {
          indicator.classList.add('step-active');
        } else {
          indicator.classList.add('step-inactive');
        }
      }
    };

    const showStep = (stepNumber) => {
      document.querySelectorAll('.step').forEach(el => el.classList.add('hidden'));
      document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
      updateProgressIndicator();
    };

    const renderTherapists = (therapists) => {
      const therapistList = document.getElementById('therapist-list');
      therapistList.innerHTML = '';
      therapists.forEach(therapist => {
        const therapistDiv = document.createElement('div');
        therapistDiv.className = `p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition ${selectedTherapist?.tCode === therapist.tCode ? 'border-blue-500 bg-blue-50' : ''}`;
        therapistDiv.innerHTML = `
          <img src="${therapist.img || 'https://via.placeholder.com/150'}" alt="${therapist.firstName} ${therapist.lastName}" class="w-16 h-16 rounded-full mb-2">
          <h3 class="font-semibold text-lg">${therapist.firstName} ${therapist.lastName}</h3>
          <div class="mt-2 text-gray-600">Therapist Code: ${therapist.tCode}</div>
        `;
        therapistDiv.addEventListener('click', () => {
          selectedTherapist = therapist;
          renderTherapists(therapists);
          document.getElementById('next-step-2').disabled = false;
        });
        therapistList.appendChild(therapistDiv);
      });
    };

    const renderDates = () => {
      const dateList = document.getElementById('date-list');
      dateList.innerHTML = '';
      dates.forEach((date, index) => {
        const dateDiv = document.createElement('div');
        dateDiv.className = `p-3 border rounded-md text-center cursor-pointer hover:border-blue-500 transition ${selectedDate && date.toDateString() === selectedDate.toDateString() ? 'border-blue-500 bg-blue-50' : ''}`;
        dateDiv.innerHTML = `
          <div class="font-medium">${date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
          <div class="text-lg">${date.getDate()}</div>
          <div class="text-xs">${date.toLocaleDateString('en-US', { month: 'short' })}</div>
        `;
        dateDiv.addEventListener('click', () => {
          selectedDate = date;
          renderDates();
          document.getElementById('time-slot-section').classList.remove('hidden');
          renderTimeSlots();
        });
        dateList.appendChild(dateDiv);
      });
    };

    const renderTimeSlots = () => {
      const timeSlotList = document.getElementById('time-slot-list');
      timeSlotList.innerHTML = '';
      timeSlots.forEach((time, index) => {
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.className = `p-2 border rounded-md text-center cursor-pointer hover:border-blue-500 transition ${selectedTime === time ? 'border-blue-500 bg-blue-50' : ''}`;
        timeSlotDiv.innerHTML = time;
        timeSlotDiv.addEventListener('click', () => {
          selectedTime = time;
          renderTimeSlots();
          document.getElementById('next-step-3').disabled = false;
        });
        timeSlotList.appendChild(timeSlotDiv);
      });
    };

    const renderConfirmation = () => {
      document.getElementById('confirm-therapist-name').textContent = `${selectedTherapist.firstName} ${selectedTherapist.lastName}`;
      document.getElementById('confirm-therapist-specialty').textContent = `Therapist Code: ${selectedTherapist.tCode}`;
      document.getElementById('confirm-date-time').textContent = `${formatDate(selectedDate)} at ${selectedTime}`;
    };

    document.getElementById('next-step-2').addEventListener('click', () => {
      step = 3;
      showStep(step);
    });

    document.getElementById('next-step-3').addEventListener('click', () => {
      step = 4;
      showStep(step);
      renderConfirmation();
    });

    document.getElementById('back-step-3').addEventListener('click', () => {
      step = 2;
      showStep(step);
    });

    document.getElementById('back-step-4').addEventListener('click', () => {
      step = 3;
      showStep(step);
    });

    document.getElementById('confirm-booking').addEventListener('click', () => {
      const meetData = JSON.parse(localStorage.getItem('meetData'));
      if (meetData) {
        // Add therapist and exact date/time data selected in step 3
        meetData.therapistId = selectedTherapist._id; // Save therapist ID
        meetData.date = selectedDate.toISOString().split('T')[0]; // Use selected date from step 3
        meetData.time = selectedTime; // Use selected time from step 3

        fetch('/api/meets/saveMeet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetData),
        })
          .then(response => response.json())
          .then(result => {
            if (result.error) {
              alert(`Error saving meet data: ${result.error}`);
            } else {
              alert('Meet data saved successfully!');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Failed to save meet data.');
          });
      } else {
        alert('No meet data found in localStorage.');
      }
    });

    try {
      const response = await fetch('/api/therapists/all');
      const therapists = await response.json();
      renderTherapists(therapists);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }

    renderDates();
  });