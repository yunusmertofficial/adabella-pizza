import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const CustomBreadcrumb = ({
  items,
}: {
  items: Array<{ label: string; href?: string }>;
}) => {
  if (!items || items.length === 0) {
    return null; // Eğer items yoksa veya boşsa hiçbir şey render etme
  }

  return (
    <Breadcrumb className="mb-4">
      {" "}
      {/* mb-4 ekledim, isterseniz kaldırabilirsiniz */}
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
