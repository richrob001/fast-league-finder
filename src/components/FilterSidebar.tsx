import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sports = ["Basketball", "Soccer", "Tennis", "Volleyball", "Baseball", "Hockey"];
const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const locations = ["Downtown", "North Side", "South Side", "West End", "East District"];

export const FilterSidebar = () => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sport Type */}
        <div>
          <h3 className="font-semibold mb-3">Sport Type</h3>
          <div className="flex flex-wrap gap-2">
            {sports.map((sport) => (
              <Badge 
                key={sport} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Skill Level */}
        <div>
          <h3 className="font-semibold mb-3">Skill Level</h3>
          <div className="flex flex-wrap gap-2">
            {skillLevels.map((level) => (
              <Badge 
                key={level} 
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div>
          <h3 className="font-semibold mb-3">Location</h3>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Badge 
                key={location} 
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {location}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};