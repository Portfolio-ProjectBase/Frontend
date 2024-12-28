"use client";
import React, { useEffect, useState } from "react";
import { fetchCourses } from "@/services/courseService";
import styles from "./courses.module.css";

interface Course {
  id: number;
  name: string;
  instructor: string;
  detail: string;
  date: string;
}

const CoursesContainer: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <section className={styles.courseSection}>
      <h1 className={styles.title}>Courses</h1>
      {courses.length ? (
        <div className={styles.cardGrid}>
          {courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <h2 className={styles.courseName}>{course.name}</h2>
              <p className={styles.courseInstructor}>
                <strong>Instructor:</strong> {course.instructor}
              </p>
              <p className={styles.courseDetail}>{course.detail}</p>
              <p className={styles.courseDate}>
                <strong>Date:</strong> {new Date(course.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noCourses}>No courses found.</p>
      )}
    </section>
  );
};

export default CoursesContainer;