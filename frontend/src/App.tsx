import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Loader2, Package, DollarSign, Shield, Layers, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { FormData, Metadata, PredictionResponse } from './types';

function App() {
    const [formData, setFormData] = useState<FormData>({
        category: '',
        size: '',
        type: 'Free',
        price: '0',
        contentRating: ''
    });

    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/metadata`);
            if (!response.ok) {
                throw new Error('Failed to fetch metadata');
            }
            const data = await response.json();
            setMetadata(data);
            if (data.categories.length > 0) {
                setFormData(prev => ({ ...prev, category: data.categories[0] }));
            }
            if (data.content_ratings.length > 0) {
                setFormData(prev => ({ ...prev, contentRating: data.content_ratings[0] }));
            }
        } catch (err) {
            setError('Failed to load metadata. Please ensure the backend is running.');
            console.error('Metadata fetch error:', err);
        }
    };

    const handleInputChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'type' && value === 'Free') {
            setFormData(prev => ({ ...prev, price: '0' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: formData.category,
                    size: parseFloat(formData.size),
                    type: formData.type,
                    price: parseFloat(formData.price),
                    contentRating: formData.contentRating
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Prediction failed');
            }

            setPrediction(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Prediction failed. Please try again.');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPrediction(null);
        setError(null);
    };

    if (!metadata) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading predictor...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
            <div className="w-full max-w-4xl slide-up-fade">
                {/* Header */}
                <header className="text-center mb-8 md:mb-12">
                    <div className="inline-block mb-4 float-animation">
                        <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-primary drop-shadow-lg" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        App Success Predictor
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Predict your Google Play Store app's success using AI-powered analytics
                    </p>
                </header>

                {/* Main Card */}
                <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">App Details</CardTitle>
                        <CardDescription>
                            Enter your app information to get a success prediction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category" className="flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-muted-foreground" />
                                        App Category
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange('category', value)}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metadata.categories.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Size */}
                                <div className="space-y-2">
                                    <Label htmlFor="size" className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        App Size (MB)
                                    </Label>
                                    <Input
                                        id="size"
                                        type="number"
                                        value={formData.size}
                                        onChange={(e) => handleInputChange('size', e.target.value)}
                                        placeholder="e.g., 25.5"
                                        step="0.1"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="flex items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                                        App Type
                                    </Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => handleInputChange('type', value)}
                                    >
                                        <SelectTrigger id="type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metadata.types.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Price (USD)
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        placeholder="e.g., 2.99"
                                        step="0.01"
                                        min="0"
                                        disabled={formData.type === 'Free'}
                                        required
                                    />
                                </div>

                                {/* Content Rating */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="contentRating" className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        Content Rating
                                    </Label>
                                    <Select
                                        value={formData.contentRating}
                                        onValueChange={(value) => handleInputChange('contentRating', value)}
                                    >
                                        <SelectTrigger id="contentRating">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {metadata.content_ratings.map(rating => (
                                                <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Predict Success
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="mt-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Prediction Result */}
                        {prediction && (
                            <Card className={`mt-6 ${prediction.success ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                                <CardHeader className="text-center pb-4">
                                    <div className="flex justify-center mb-4">
                                        {prediction.success ? (
                                            <TrendingUp className="h-16 w-16 text-green-500" />
                                        ) : (
                                            <TrendingDown className="h-16 w-16 text-red-500" />
                                        )}
                                    </div>
                                    <CardTitle className="text-3xl">{prediction.prediction}</CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {prediction.message}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Separator className="mb-6" />
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                            Input Summary
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Category</p>
                                                <Badge variant="secondary">{prediction.details.category}</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Size</p>
                                                <Badge variant="secondary">{prediction.details.size} MB</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Type</p>
                                                <Badge variant="secondary">{prediction.details.type}</Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Price</p>
                                                <Badge variant="secondary">${prediction.details.price}</Badge>
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <p className="text-xs text-muted-foreground">Content Rating</p>
                                                <Badge variant="secondary">{prediction.details.contentRating}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="w-full mt-6"
                                    >
                                        Try Another Prediction
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default App;