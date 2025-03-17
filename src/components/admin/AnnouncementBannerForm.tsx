
import React, { useState } from 'react';
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
import { updateAnnouncementBanner } from '@/services/announcementService';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from "@/components/ui/switch";

const announcementSchema = z.object({
  text: z.string().min(5, { message: "Announcement text must be at least 5 characters" }),
  isEnabled: z.boolean(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementBannerFormProps {
  initialData: { text: string; isEnabled: boolean };
  onClose: () => void;
}

const AnnouncementBannerForm: React.FC<AnnouncementBannerFormProps> = ({
  initialData,
  onClose,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      text: initialData.text,
      isEnabled: initialData.isEnabled,
    },
  });
  
  const handleFormSubmit = async (data: AnnouncementFormValues) => {
    setIsSubmitting(true);
    try {
      await updateAnnouncementBanner(data.text, data.isEnabled);
      toast({
        title: "Success",
        description: "Announcement banner updated successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "Failed to update announcement banner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Announcement Text</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g. Welcome to CryptoView! New assets added daily." 
                />
              </FormControl>
              <FormDescription>
                Text that will scroll in the announcement banner
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enable Banner</FormLabel>
                <FormDescription>
                  Show or hide the announcement banner
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnnouncementBannerForm;
