import axiosInstance from "@/lib/axios/axios-client";

class StudentCourse {
  static async getAllStudentCourses() {
    const result = await axiosInstance.get("/api/students/course");
    return await result.data;
  }
}

export default StudentCourse;
