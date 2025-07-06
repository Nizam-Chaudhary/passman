import { Input } from "@/components/ui/input";

import { Button } from "../ui/button";

function Import() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="chromeFile" className="text-sm font-medium">
          Chrome Password File
        </label>
        <Input id="chromeFile" type="file" accept=".json" />
        <Button type="button" onClick={() => console.warn("Import clicked")}>
          Import Chrome Passwords
        </Button>
      </div>
    </div>
  );
}

export default Import;
