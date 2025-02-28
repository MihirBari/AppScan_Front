import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import API_BASE_URL from '../../config';
import 'react-calendar/dist/Calendar.css';
import './holiday.css'; // Import the CSS file for custom styles
import { AuthContext } from '../../context/AuthContext';
import { PiConfettiBold } from "react-icons/pi";

const Main = () => {
  const [file, setFile] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [value, setValue] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  const { currentUser } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
    await axios.post(`${API_BASE_URL}/api/Holiday/holiday`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
     // console.log('File uploaded successfully:', response.data);
      fetchHolidays();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Holiday/holidays`,
        {
          headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
          }
        }
      );
      setHolidays(response.data);
      
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const fetchBirthdays = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Holiday/birthday`,
        {
          headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
          }
        }
      );
      setBirthdays(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    }
  };

  useEffect(() => {
    fetchHolidays();
    fetchBirthdays();
  }, []);

  const isHoliday = (date) => {
    return holidays.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === date.getFullYear() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getDate() === date.getDate()
      );
    });
  };

  const isBirthday = (date) => {
    return birthdays.some(birthday => {
      const birthdayDate = new Date(birthday.DOB);
      return (
        birthdayDate.getMonth() === date.getMonth() &&
        birthdayDate.getDate() === date.getDate()
      );
    });
  };

  const handleDateClick = (date) => {
    const holidayEvents = holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === date.getFullYear() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getDate() === date.getDate()
      );
    });

    const birthdayEvents = birthdays.filter(birthday => {
      const birthdayDate = new Date(birthday.DOB);
      return (
        birthdayDate.getMonth() === date.getMonth() &&
        birthdayDate.getDate() === date.getDate()
      );
    });

    setSelectedEvents([...holidayEvents, ...birthdayEvents]);
  };

  const handleTodayClick = () => {
    setValue(new Date());
    setSelectedEvents([]);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month' && isBirthday(date)) {
      return <PiConfettiBold style={{ color: 'green' }} />;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (isHoliday(date)) {
        return 'holiday';
      }
      if (isBirthday(date)) {
        return 'birthday';
      }
    }
    return 'default';
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold text-center">Techsa Calendar</h1>
      {currentUser.role === 'Admin' && (
        <div>
          <div className="file-upload">
            <input type="file" onChange={handleFileChange} />
          </div>
          <button onClick={handleFileUpload}>Upload File</button>
        </div>
      )}
      <Calendar
        onChange={setValue}
        value={value}
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
        tileContent={tileContent} // Add the tileContent prop
      />
          {selectedEvents.length > 0 && (
      <div className="event-details">
        {selectedEvents.map((event, index) => (
          <div key={index}>
            <h2>
              {`${event.name} ${event.surname ? event.surname : ''} ${event.DOB ? 'Birthday' : ''}`}
            </h2>
            <p>{event.DOB ? new Date(event.DOB).toDateString() : " "}</p>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Main;
