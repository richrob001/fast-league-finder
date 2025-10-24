import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface NewsCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  publishedAt?: string;
  source?: string;
  sport?: string;
}

export const NewsCard = ({
  title,
  description,
  imageUrl,
  url,
  publishedAt,
  source,
  sport,
}: NewsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all overflow-hidden">
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {sport && <Badge variant="secondary">{sport}</Badge>}
          {source && <span className="text-sm text-muted-foreground">{source}</span>}
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
        {publishedAt && (
          <CardDescription>
            {format(new Date(publishedAt), "PPP")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{description}</p>
        )}
        {url && (
          <Button variant="outline" className="w-full" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Read More
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};