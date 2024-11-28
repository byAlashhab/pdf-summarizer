"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

function FormButton({
  action,
  element,
  classes,
}: {
  action: () => Promise<void>;
  element: React.ReactNode;
  classes?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function fireAction() {
    setLoading(true);
    await action();
    setLoading(false);
  }
 
  return loading ? (
    <Loader className="animate-spin mr-2 h-5 w-5"/>
  ) : (
    <Button
      type="submit"
      variant="link"
      onClick={fireAction}
      className={classes}
    >
      {element}
    </Button>
  );
}

export default FormButton;
