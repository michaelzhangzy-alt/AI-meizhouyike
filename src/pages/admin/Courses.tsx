
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Plus, Edit, Trash } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  schedule_time: string;
  status: string;
  created_at: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个课程吗？此操作无法撤销。')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">课程管理</h2>
        <Link to="/admin/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            发布新课程
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>
                <span className={`px-2 py-0.5 rounded text-xs ${
                  course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {course.status === 'published' ? '已发布' : '草稿'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">讲师: {course.instructor}</p>
              <p className="text-sm text-gray-500 mb-4">
                时间: {new Date(course.schedule_time).toLocaleString('zh-CN')}
              </p>
            </div>
            
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Link to={`/admin/courses/edit/${course.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(course.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
