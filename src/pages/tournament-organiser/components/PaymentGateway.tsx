
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const PaymentGateway = () => {
  const handleEnablePayments = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Payment processing will be available in a future update",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Payment Gateway</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <DollarSign className="mr-2 h-5 w-5 text-green-500" />
            Tournament Payment Processing
          </CardTitle>
          <CardDescription>
            Coming Soon: Enable payment collection for tournament registration fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 flex items-center justify-center flex-col text-center">
            <Lock className="h-10 w-10 text-sport-purple mb-2" />
            <p className="text-gray-600">
              This feature is under development and will be available soon.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You'll be able to collect registration fees securely through Stripe or Razorpay.
            </p>
          </div>
          
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <Label htmlFor="stripe-toggle" className="font-medium">Stripe Payments</Label>
              </div>
              <Switch id="stripe-toggle" disabled />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <Label htmlFor="razorpay-toggle" className="font-medium">Razorpay Payments</Label>
              </div>
              <Switch id="razorpay-toggle" disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">
            Secure payment processing with end-to-end encryption
          </p>
          <Button 
            variant="outline" 
            onClick={handleEnablePayments} 
            disabled
          >
            Enable Payments
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Current Fee Collection</h3>
        <p className="text-gray-600">
          While online payment processing is not yet available, you can still set an entry fee
          for your tournament and collect payments manually.
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-gray-600">
          <li>The fee will be displayed to participants during registration</li>
          <li>Include payment instructions in your tournament rules</li>
          <li>Track payments received through your own records</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentGateway;
