
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

import { Eye, EyeOff, Calendar, Shield } from 'lucide-react';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        const success = await login(email, password);

        if (success) {
            alert('Login realizado com sucesso!');
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="text-center pb-8">
                        <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
                            <Calendar className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Sistema de Eventos
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Faça login para acessar o painel administrativo
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Login
                                </Label>
                                <Input
                                    id="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 px-4 rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Senha
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 px-4 pr-12 rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 transition-colors"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="font-medium">Credenciais de teste:</span>
                                </div>
                                <div className="pl-6 space-y-1">
                                    <p><strong>Admin:</strong> admin@eventos.com / admin123</p>
                                    <p><strong>Secretário:</strong> secretario@eventos.com / sec123</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginForm;
