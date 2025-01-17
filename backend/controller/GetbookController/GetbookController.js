const Course = require('../../models/Course'); // Your Course model
const Book = require('../../models/books'); // Your Book model

const getBooksByRoleAndCourse = async (req, res) => {
  const { role, courseId } = req.body; // Using req.body instead of req.params

  try {
    // Step 1: Find the course and extract class_id
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const classId = course.class_id;

    // Step 2: Find books based on class_id and role
    const books = await Book.find({ class_id: classId, role });

    if (!books || books.length === 0) {
      return res.status(404).json({ message: 'No books found for the given criteria' });
    }

    // Extract the first book link as a string
    const bookLink = books[0].book_link;

    // Step 3: Return the book link as a string
    res.status(200).json({ bookLink });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getBooksByRoleAndCourse };
