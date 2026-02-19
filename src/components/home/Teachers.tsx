
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

interface TeachersProps {
  onRegister: (teacherName: string) => void;
}

interface Teacher {
  id: string;
  name: string;
  title: string;
  image_url: string;
  tags: string[];
  description: string;
}

export function Teachers({ onRegister }: TeachersProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
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

  if (loading) return null; // Or a loading spinner

  return (
    <section className="py-16 md:py-24 bg-background transition-colors duration-300">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">师资力量</h2>
          <p className="text-lg text-muted-foreground">来自大厂的实战专家，为你领路</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border">
              <div className="aspect-square w-full relative bg-muted">
                 {teacher.image_url ? (
                   <img 
                     src={teacher.image_url} 
                     alt={teacher.name} 
                     className="object-cover w-full h-full"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                     暂无照片
                   </div>
                 )}
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {teacher.tags?.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-foreground">{teacher.name}</h3>
                <p className="text-sm font-medium text-primary">{teacher.title}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3">{teacher.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => onRegister(`预约-${teacher.name}`)}>
                  预约试听
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
