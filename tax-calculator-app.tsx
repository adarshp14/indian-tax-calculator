import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Wallet, PiggyBank, Banknote, TrendingUp, ChevronRight } from 'lucide-react';

const TaxCalculator = () => {
  const [salary, setSalary] = useState('');
  const [isSpending, setIsSpending] = useState(false);
  const [isInvesting, setIsInvesting] = useState(false);
  const [spendPercentage, setSpendPercentage] = useState('');
  const [investPercentage, setInvestPercentage] = useState('');
  const [spendType, setSpendType] = useState('basic');
  const [investmentOutcome, setInvestmentOutcome] = useState('no');
  const [investmentSpeed, setInvestmentSpeed] = useState('no');
  const [taxAmount, setTaxAmount] = useState(0);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [additionalTax, setAdditionalTax] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const taxSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];

  useEffect(() => {
    calculateTax();
  }, [salary, isSpending, isInvesting, spendPercentage, investPercentage, spendType, investmentOutcome, investmentSpeed]);

  const calculateTax = () => {
    if (!salary) {
      setTaxAmount(0);
      setTaxBreakdown([]);
      setAdditionalTax(0);
      setRemainingAmount(0);
      return;
    }

    const salaryValue = parseFloat(salary);
    let totalTax = 0;
    let remainingSalary = salaryValue;
    const breakdown = [];
    let previousLimit = 0;

    for (const slab of taxSlabs) {
      if (remainingSalary > 0) {
        const taxableAmount = Math.min(remainingSalary, slab.limit - previousLimit);
        const taxForSlab = taxableAmount * slab.rate;
        totalTax += taxForSlab;
        
        if (taxForSlab > 0) {
          breakdown.push({
            slab: `₹${formatNumber(previousLimit)} - ₹${formatNumber(slab.limit)}`,
            rate: `${slab.rate * 100}%`,
            tax: taxForSlab
          });
        }
        
        remainingSalary -= taxableAmount;
        previousLimit = slab.limit;
      } else {
        break;
      }
    }

    let additionalTaxAmount = 0;
    if (isSpending) {
      const spendAmount = salaryValue * (parseFloat(spendPercentage) / 100);
      if (spendType === 'basic') additionalTaxAmount += spendAmount * 0.12;
      else if (spendType === 'kindOfFancy') additionalTaxAmount += spendAmount * 0.18;
      else if (spendType === 'veryFancy') additionalTaxAmount += spendAmount * 0.28;
    }
    
    if (isInvesting && investmentOutcome === 'yes') {
      const investAmount = salaryValue * (parseFloat(investPercentage) / 100);
      additionalTaxAmount += investmentSpeed === 'yes' ? investAmount * 0.2 : investAmount * 0.125;
    }

    setTaxAmount(totalTax);
    setTaxBreakdown(breakdown);
    setAdditionalTax(additionalTaxAmount);
    setRemainingAmount(salaryValue - totalTax - additionalTaxAmount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatRupees = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center">
            <CreditCard className="mr-2" />
            Comprehensive Indian Income Tax Calculator (FY 2024-25)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="salary" className="text-lg font-semibold text-gray-700 flex items-center">
              <Wallet className="mr-2" />
              Annual Income (in Rupees)
            </Label>
            <Input
              id="salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter your annual income"
              className="mt-1 text-lg"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-700">How will you use your money?</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isSpending" 
                checked={isSpending} 
                onCheckedChange={setIsSpending}
              />
              <Label htmlFor="isSpending" className="flex items-center cursor-pointer">
                <Banknote className="mr-2" />
                Spend
              </Label>
              {isSpending && (
                <Input
                  type="number"
                  value={spendPercentage}
                  onChange={(e) => setSpendPercentage(e.target.value)}
                  placeholder="% to spend"
                  className="w-24 ml-2"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isInvesting" 
                checked={isInvesting} 
                onCheckedChange={setIsInvesting}
              />
              <Label htmlFor="isInvesting" className="flex items-center cursor-pointer">
                <TrendingUp className="mr-2" />
                Invest
              </Label>
              {isInvesting && (
                <Input
                  type="number"
                  value={investPercentage}
                  onChange={(e) => setInvestPercentage(e.target.value)}
                  placeholder="% to invest"
                  className="w-24 ml-2"
                />
              )}
            </div>
          </div>

          {isSpending && (
            <div>
              <Label className="text-lg font-semibold text-gray-700">What kind of spends?</Label>
              <Select value={spendType} onValueChange={setSpendType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select spend type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (12% tax)</SelectItem>
                  <SelectItem value="kindOfFancy">Kind of Fancy (18% tax)</SelectItem>
                  <SelectItem value="veryFancy">Very Fancy (28% tax)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {isInvesting && (
            <>
              <div>
                <Label className="text-lg font-semibold text-gray-700">Did you make money on your investment?</Label>
                <Select value={investmentOutcome} onValueChange={setInvestmentOutcome}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select investment outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {investmentOutcome === 'yes' && (
                <div>
                  <Label className="text-lg font-semibold text-gray-700">Did you make it quickly?</Label>
                  <Select value={investmentSpeed} onValueChange={setInvestmentSpeed}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select investment speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes (20% tax)</SelectItem>
                      <SelectItem value="no">No (12.5% tax)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {(taxAmount > 0 || additionalTax > 0) && (
            <Alert className="bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
              <AlertTitle className="text-xl font-bold text-gray-800 flex items-center">
                <ChevronRight className="mr-2" />
                Tax Calculation Result
              </AlertTitle>
              <AlertDescription>
                <div className="space-y-2 mt-3">
                  <p className="text-lg font-semibold text-gray-700">Income tax: {formatRupees(taxAmount)}</p>
                  <p className="text-lg font-semibold text-gray-700">Additional tax: {formatRupees(additionalTax)}</p>
                  <p className="text-lg font-semibold text-gray-700">Total tax: {formatRupees(taxAmount + additionalTax)}</p>
                  <p className="text-lg font-semibold text-green-700">Take-home amount: {formatRupees(remainingAmount)}</p>
                  <div className="mt-4">
                    <Label className="text-sm text-gray-600">Total Tax Percentage</Label>
                    <Progress value={((taxAmount + additionalTax) / parseFloat(salary || 1)) * 100} className="h-2 mt-1" />
                  </div>
                  {taxBreakdown.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-gray-700">Tax Breakdown</h4>
                      <table className="w-full mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-2 text-left">Slab</th>
                            <th className="p-2 text-left">Rate</th>
                            <th className="p-2 text-left">Tax</th>
                          </tr>
                        </thead>
                        <tbody>
                          {taxBreakdown.map((slab, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">{slab.slab}</td>
                              <td className="p-2">{slab.rate}</td>
                              <td className="p-2">{formatRupees(slab.tax)}</td>
                            </tr>
                          ))}
                          {additionalTax > 0 && (
                            <tr className="border-b font-semibold">
                              <td className="p-2">Additional Tax</td>
                              <td className="p-2">-</td>
                              <td className="p-2">{formatRupees(additionalTax)}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxCalculator;
