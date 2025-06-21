import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Crown, Star, Zap, Users, Shield } from 'lucide-react';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const donationTiers = [
    {
      amount: 5,
      title: "Civic Supporter",
      icon: Heart,
      benefits: ["Monthly transparency reports", "Access to basic analytics"],
      color: "bg-blue-500"
    },
    {
      amount: 15,
      title: "Democracy Advocate", 
      icon: Users,
      benefits: ["Everything above", "Priority notification alerts", "Exclusive civic insights"],
      color: "bg-green-500",
      popular: true
    },
    {
      amount: 50,
      title: "Transparency Champion",
      icon: Shield,
      benefits: ["Everything above", "Advanced data exports", "Direct developer feedback channel"],
      color: "bg-purple-500"
    },
    {
      amount: 100,
      title: "Democracy Patron",
      icon: Crown,
      benefits: ["Everything above", "Custom research requests", "Platform governance voting rights"],
      color: "bg-gold-500"
    }
  ];

  const handleDonate = async (amount: number) => {
    try {
      console.log('Creating payment session for amount:', amount);
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      console.log('Payment response:', data);

      if (response.ok && data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error('Failed to create payment session:', data);
        alert('Failed to create payment session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Error creating payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support CivicOS
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Help us build the most comprehensive political transparency platform Canada has ever seen. 
            Every dollar brings us closer to true democratic accountability.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600 mb-2">85,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Politicians Tracked</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600 mb-2">12,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Bills Analyzed</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
              <div className="text-gray-600 dark:text-gray-400">Real-time Monitoring</div>
            </CardContent>
          </Card>
        </div>

        {/* Donation Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {donationTiers.map((tier) => (
            <Card 
              key={tier.amount} 
              className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAmount === tier.amount ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => {
                setSelectedAmount(tier.amount);
                handleDonate(tier.amount);
              }}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <tier.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{tier.title}</CardTitle>
                <div className="text-3xl font-bold text-red-600">${tier.amount}</div>
                <div className="text-sm text-gray-500">CAD / month</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Star className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Amount */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Custom Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-2xl font-bold">$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-2xl font-bold border-b-2 border-gray-300 focus:border-red-500 outline-none bg-transparent text-center w-32"
                min="1"
              />
              <span className="text-gray-500">CAD</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => selectedAmount && handleDonate(selectedAmount)}
            disabled={!selectedAmount}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg"
            size="lg"
          >
            <Heart className="w-5 h-5 mr-2" />
            Donate ${selectedAmount || 0}
          </Button>
          <Button
            onClick={() => customAmount && handleDonate(parseInt(customAmount))}
            disabled={!customAmount || parseInt(customAmount) < 1}
            variant="outline"
            className="px-8 py-3 text-lg border-red-500 text-red-600 hover:bg-red-50"
            size="lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            Donate ${customAmount || 0}
          </Button>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg opacity-90">
              CivicOS exists to make Canadian democracy more transparent, accountable, and accessible to every citizen. 
              Your support directly funds the development of tools that expose corruption, track political promises, 
              and empower Canadians with the information they need to hold their representatives accountable.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}