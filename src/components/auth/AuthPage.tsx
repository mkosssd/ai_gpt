import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PhoneInput } from './PhoneInput';
import { OTPInput } from './OTPInput';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, ArrowLeft } from 'lucide-react';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  countryCode: z.string().min(2, 'Please select a country'),
  dialCode: z.string().min(1, 'Invalid country selection'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

export function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
      countryCode: 'US',
      dialCode: '+1',
    },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onPhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPhoneData(data);
      setStep('otp');
      setIsLoading(false);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${data.dialCode} ${data.phone}`,
      });
    }, 1500);
  };

  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      if (data.otp === '123456') {
        // Success
        const user = {
          id: `user-${Date.now()}`,
          phone: phoneData!.phone,
          countryCode: phoneData!.countryCode,
          isAuthenticated: true,
        };
        
        setUser(user);
        toast({
          title: "Welcome to Gemini!",
          description: "You've been successfully authenticated.",
        });
      } else {
        // Error
        otpForm.setError('otp', {
          type: 'manual',
          message: 'Invalid OTP. Use 123456 for demo.',
        });
        toast({
          title: "Invalid OTP",
          description: "Please use 123456 for demo purposes.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${phoneData?.dialCode} ${phoneData?.phone}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Welcome to Gemini
          </h1>
          <p className="text-primary-foreground/80">
            {step === 'phone' 
              ? 'Enter your phone number to get started'
              : 'Enter the verification code we sent you'
            }
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {step === 'phone' ? 'Sign In' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'We\'ll send you a verification code'
                : `Code sent to ${phoneData?.dialCode} ${phoneData?.phone}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'phone' && (
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value}
                            countryCode={phoneForm.watch('countryCode')}
                            onValueChange={field.onChange}
                            onCountryChange={(countryCode, dialCode) => {
                              phoneForm.setValue('countryCode', countryCode);
                              phoneForm.setValue('dialCode', dialCode);
                            }}
                            error={phoneForm.formState.errors.phone?.message}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    variant="gradient"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              </Form>
            )}

            {step === 'otp' && (
              <div className="space-y-6">
                <Button
                  variant="ghost"
                  onClick={() => setStep('phone')}
                  className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Change phone number
                </Button>
                
                <Form {...otpForm}>
                  <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-6">
                    <FormField
                      control={otpForm.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-center block">Enter OTP</FormLabel>
                          <FormControl>
                            <OTPInput
                              value={field.value}
                              onChange={field.onChange}
                              error={otpForm.formState.errors.otp?.message}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        variant="gradient"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendOTP}
                        className="w-full"
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </form>
                </Form>
                
                <p className="text-sm text-muted-foreground text-center">
                  Demo: Use <code className="bg-muted px-1 py-0.5 rounded">123456</code> as OTP
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}