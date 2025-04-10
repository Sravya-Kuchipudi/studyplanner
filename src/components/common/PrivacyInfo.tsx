
import { useState } from "react";
import { Shield, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PrivacyInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-md">
          <Shield className="h-5 w-5 mr-2 text-studyhub-600" />
          Data Privacy & Security
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          How we protect your study data and privacy
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-studyhub-600" />
            <span>All study data is stored locally on your device by default</span>
          </div>
          
          {isExpanded && (
            <>
              <Separator />
              
              <div className="space-y-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium">Local Storage</h4>
                  <p className="text-muted-foreground">
                    Your study schedule, notes and progress are stored locally on your device.
                    This means your data remains private and accessible even without an internet connection.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Optional Account Sync</h4>
                  <p className="text-muted-foreground">
                    If you create an account, you can choose to sync your data across devices.
                    We encrypt all synced data and never share it with third parties.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Analytics & Cookies</h4>
                  <p className="text-muted-foreground">
                    By default, we collect minimal anonymous usage data to improve the app.
                    You can disable analytics in settings at any time.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Your Rights</h4>
                  <p className="text-muted-foreground">
                    You can export or delete all your data at any time from settings.
                    We comply with GDPR, CCPA, and other privacy regulations.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacyInfo;
