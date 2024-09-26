import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

            const Intro: React.FC = () => {
                return (
                    <Card className="mb-8 bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="text-4xl text-white">Welcome to SPEED</CardTitle>
                            <CardDescription className="text-2xl">Systematic Program for Evaluating and Enriching Documents</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">SPEED is your go-to platform for accessing a vast database of articles. Whether you're a researcher, student, or knowledge enthusiast, our collection has something for everyone.</p>
                        </CardContent>
                    </Card>
                );
            };

            export default Intro;