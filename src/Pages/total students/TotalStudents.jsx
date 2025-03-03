import { useState, useEffect } from 'react';
import { db } from '../../Firebase'; // Firebase configuration
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom'; // Navigation
import styles from '../total students/TotalStudents.module.css'; // Import styles

const TotalStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation to chat

  // Fetch student data from Firebase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'students'); // Fetch from 'students' collection
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsList = studentsSnapshot.docs.map((doc) => ({
          id: doc.id, // Add doc.id to identify students uniquely
          ...doc.data()
        }));
        setStudents(studentsList);
      } catch (error) {
        setError('Error fetching student data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Function to handle printing
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=500, width=800');
    printWindow.document.write('<html><head><title>Student List</title>');
    printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; } td, th { padding: 8px; border: 1px solid black; }</style></head><body>');
    printWindow.document.write('<h1>Student List</h1>');
    printWindow.document.write(`<p>Total Students: ${students.length}</p>`); {/* Display count */}
    printWindow.document.write('<table><thead><tr><th>Name</th><th>Folio</th><th>House</th><th>Email</th></tr></thead><tbody>');
    
    students.forEach(student => {
      printWindow.document.write(`<tr><td>${student.name || 'N/A'}</td><td>${student.folio || 'N/A'}</td><td>${student.house || 'N/A'}</td><td>${student.email || 'N/A'}</td></tr>`);
    });
  
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  // Function to delete a student
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) return;

    try {
      // Get the reference to the student document using the ID
      const studentDocRef = doc(db, 'students', studentId);

      // Delete the document from Firestore
      await deleteDoc(studentDocRef);

      // Remove the deleted student from the local state
      setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
    } catch (error) {
      setError('Error deleting student: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>View Total Students</h1>
      
      {/* Print button */}
      <button className={styles.printButton} onClick={handlePrint}>Print Student List</button>

      <div className={styles.studentList}>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <>
            {/* Display Total Students */}
            <p>Total Students: {students.length}</p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Folio</th>
                  <th>House</th>
                  <th>Email</th>
                  <th>Actions</th> {/* Add action column */}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.folio}</td>
                    <td>{student.house}</td>
                    <td>{student.email}</td>
                    <td>
                      {/* Chat Button */}
                      <button 
                        className={styles.chatButton}
                        onClick={() => navigate(`/Chat?studentId=${student.id}`)}
                      >
                        Chat
                      </button>
                      {/* Delete Button */}
                      <button 
                        className={styles.deleteButton} 
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default TotalStudents;