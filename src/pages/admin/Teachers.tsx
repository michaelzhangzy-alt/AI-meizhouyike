
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Plus, Edit, Trash, GripVertical } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  title: string;
  image_url: string;
  tags: string[];
  display_order: number;
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这位讲师吗？')) return;

    try {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('删除失败');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">师资管理</h2>
        <Link to="/admin/teachers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            添加讲师
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="overflow-hidden flex flex-col">
            <div className="aspect-square w-full relative bg-gray-100">
              {teacher.image_url ? (
                <img 
                  src={teacher.image_url} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  无头像
                </div>
              )}
            </div>
            <div className="p-4 flex-1">
              <h3 className="font-bold text-lg">{teacher.name}</h3>
              <p className="text-sm text-blue-600 mb-2">{teacher.title}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {teacher.tags?.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 pt-0 mt-auto flex justify-end gap-2 border-t pt-4">
              <Link to={`/admin/teachers/edit/${teacher.id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(teacher.id)}
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
