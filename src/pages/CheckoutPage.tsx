import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const getDeliveryFee = () => (total >= 500 ? 0 : 50);
  const getFinalTotal = () => total + getDeliveryFee();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let customer: any = null;
    let order: any = null;

    try {
      // 1️⃣ Insert customer
      const { data: customerData, error: customerError } = await supabase
  .from("customers")
  .insert({
    full_name: customerInfo.fullName,
    email: customerInfo.email,
    phone: customerInfo.phone,
    address: customerInfo.address,
    city: customerInfo.city,
    state: customerInfo.state,
    pincode: customerInfo.pincode,
    notes: customerInfo.notes,
  })
  .select()
  .single();
if (customerError) throw customerError;
const customer = customerData;

      // 2️⃣ Insert order
      const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`;
      const { data: orderData, error: orderError } = await supabase
  .from("orders")
  .insert({
    customer_id: customer.id,
    total_amount: getFinalTotal(),
    shipping_address: shippingAddress,
    status: "confirmed",
  })
  .select()
  .single();

if (orderError) throw orderError;
const order = orderData;


      // 3️⃣ Insert order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // ✅ Success
      clearCart();
      const orderIdDisplay = typeof order.id === 'string' ? order.id.slice(0, 8) : order.id;
      toast({
        title: "Order Confirmed! 🎉",
        description: `Your order #${orderIdDisplay} has been placed successfully.`,
      });

      navigate('/order-confirmation', {
        state: { orderId: order.id, customerInfo, items, total: getFinalTotal() }
      });

    } catch (error: any) {
      console.error('Order submission error:', error);

      // ⚠️ Rollback if order items failed
      if (order?.id) await supabase.from('orders').delete().eq('id', order.id);
      if (customer?.id) await supabase.from('customers').delete().eq('id', customer.id);

      toast({
        title: "Order Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/cart')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your eco-friendly purchase</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" name="fullName" value={customerInfo.fullName} onChange={handleInputChange} required placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={customerInfo.email} onChange={handleInputChange} required placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" value={customerInfo.phone} onChange={handleInputChange} required placeholder="+91 98765 43210" />
                </div>

                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea id="address" name="address" value={customerInfo.address} onChange={handleInputChange} required placeholder="House/Flat No., Street, Landmark" rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={customerInfo.city} onChange={handleInputChange} required placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" name="state" value={customerInfo.state} onChange={handleInputChange} required placeholder="State" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input id="pincode" name="pincode" value={customerInfo.pincode} onChange={handleInputChange} required placeholder="123456" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Instructions (Optional)</Label>
                  <Textarea id="notes" name="notes" value={customerInfo.notes} onChange={handleInputChange} placeholder="Any special delivery instructions" rows={2} />
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-white">Pay when your eco-friendly products are delivered to your doorstep.</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Processing...' : 'Place Order'}
            </Button>
          </form>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}

                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between"><span>Delivery Fee</span><span>{getDeliveryFee() === 0 ? <span className="text-green-600">FREE</span> : formatPrice(getDeliveryFee())}</span></div>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(getFinalTotal())}</span></div>
                <p className="text-xs text-center text-muted-foreground">By placing this order, you agree to our terms and conditions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
