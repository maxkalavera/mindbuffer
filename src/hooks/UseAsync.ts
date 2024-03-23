import React, { useEffect } from "react";

export default function useAsync(
  func: (...args:any[]) => any,
  deps?: React.DependencyList | undefined,
  args: any[] = [],
) {

  useEffect(() => {
    (async() => {
      await func(...args)
    })()
  }, deps)

}