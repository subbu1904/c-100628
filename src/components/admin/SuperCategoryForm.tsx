
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SuperCategory } from '@/services/superCategoryService';
import { useToast } from '@/components/ui/use-toast';

const superCategorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  slug: z.string()
    .min(2, { message: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  color: z.string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, { 
      message: "Color must be a valid hex code (e.g. #FF0000)" 
    }),
  isEnabled: z.boolean().default(true),
});

type SuperCategoryFormValues = z.infer<typeof superCategorySchema>;

interface SuperCategoryFormProps {
  initialData?: Partial<SuperCategory>;
  onSubmit: (data: SuperCategoryFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SuperCategoryForm: React.FC<SuperCategoryFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const { toast } = useToast();
  
  const form = useForm<SuperCategoryFormValues>({
    resolver: zodResolver(superCategorySchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      slug: initialData?.slug || '',
      color: initialData?.color || '#3B82F6',
      isEnabled: initialData?.isEnabled !== undefined ? initialData.isEnabled : true,
    },
  });
  
  const handleFormSubmit = async (data: SuperCategoryFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to save super category. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!form.getValues('slug') || initialData?.slug === undefined) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder="e.g. Cryptocurrencies" 
                />
              </FormControl>
              <FormDescription>
                Display name for the super category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="e.g. Digital or virtual currencies that use cryptography for security" 
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Brief description of what this super category represents
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g. cryptocurrencies" 
                  />
                </FormControl>
                <FormDescription>
                  URL-friendly identifier
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="#3B82F6" 
                    />
                  </FormControl>
                  <div 
                    className="w-10 h-10 rounded-md border border-border"
                    style={{ backgroundColor: field.value }}
                  />
                </div>
                <FormDescription>
                  Hex color code
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Enabled</FormLabel>
                <FormDescription>
                  Show this super category on the homepage
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Super Category' : 'Create Super Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SuperCategoryForm;
