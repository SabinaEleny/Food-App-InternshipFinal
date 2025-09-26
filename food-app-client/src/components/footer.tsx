import { Facebook, Github, Heart, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
    return (
        <footer
            className="bg-black/90 w-full text-[var(--color-card)] border-t mb-0 mt-10 border-t-[var(--color-border)]"
        >
            <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-10 md:flex-row">
                    <div className="max-w-xs">
                        <h2 className="text-2xl font-bold">
                            Tastely
                        </h2>
                        <p className="mt-2 text-sm text-[var(--color-muted-foreground)] max-w-[320px]">
                            Discover new tastes. Your food is just a click away!
                        </p>
                    </div>

                    <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
                        <nav aria-label="navigation">
                            <h3 className="font-semibold tracking-wide">
                                Navigation
                            </h3>

                            <div className="mt-4 flex flex-col space-y-2">
                                <a
                                    href="/"
                                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-hover"
                                >
                                    Home
                                </a>

                                <a
                                    href="/comingsoon"
                                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-hover"
                                >
                                    Blog
                                </a>
                            </div>
                        </nav>

                        <nav aria-label="legal">
                            <h3 className="font-semibold tracking-wide">
                                Legal
                            </h3>

                            <div className="mt-4 flex flex-col space-y-2">
                                <a
                                    href="/comingsoon"
                                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-hover"
                                >
                                    Terms & Conditions
                                </a>

                                <a
                                    href="/comingsoon"
                                    className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-hover"
                                >
                                    Privacy Policy
                                </a>
                            </div>
                        </nav>

                        <div aria-label="follow us">
                            <h3 className="font-semibold tracking-wide">
                                Follow us
                            </h3>

                            <div className="mt-4 flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-[1px] border-[var(--color-border)] text-[var(--color-muted-foreground)] bg-card shadow-[0_4px_5px_var(--color-shadow-color)] hover:bg-[var(--color-hover)]"
                                    aria-label="twitter"
                                >
                                    <a href="/comingsoon" aria-label="Twitter"
                                       className="inline-flex items-center justify-center">
                                        <Twitter className="h-5 w-5"/>
                                    </a>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-[1px] border-[var(--color-border)] text-[var(--color-muted-foreground)] bg-card shadow-[0_4px_5px_var(--color-shadow-color)] hover:bg-[var(--color-hover)]"
                                    aria-label="facebook"
                                >
                                    <a href="/comingsoon" aria-label="Facebook"
                                       className="inline-flex items-center justify-center">
                                        <Facebook className="h-5 w-5"/>
                                    </a>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-[1px] border-[var(--color-border)] text-[var(--color-muted-foreground)] bg-card shadow-[0_4px_5px_var(--color-shadow-color)] hover:bg-[var(--color-hover)]"
                                    aria-label="github"
                                >
                                    <a href="/comingsoon" aria-label="GitHub" className="inline-flex items-center justify-center">
                                        <Github className="h-5 w-5"/>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 border-t border-t-[var(--color-border)]"/>

                <div className="text-center">
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                        © 2025 Tastely. All rights reserved.
                    </p>

                    <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                        Made with <Heart size={12} className="text-[var(--color-primary)]"/> by the Tastely
                        team.
                    </p>
                </div>
            </div>
        </footer>
    );
}
