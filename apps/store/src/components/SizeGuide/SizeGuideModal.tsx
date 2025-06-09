// src/components/SizeGuide/SizeGuideModal.tsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Ruler, ExternalLink, User } from "lucide-react";
import SizeTable from "./SizeTable";
import { SizeGuideModalProps, MeasurementTip } from "./types";
import {
  sizeCategories,
  measurementTips,
  getSizeCategoryFromProduct,
  getProductTypeFromCategory,
} from "./data";
import { Modal, Button, Card, CardContent } from "@thefolk/ui";

const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  productCategory,
  productType,
}) => {
  const { sizeCategory, tableType, relevantTips } = useMemo(() => {
    const sizeCategory = getSizeCategoryFromProduct(productCategory);
    const detectedType = getProductTypeFromCategory(productCategory);
    const finalType = productType || detectedType;

    // Determine which table to show
    const tableType = finalType === "shoes" ? "shoes" : "clothing";

    // Get relevant measurement tips
    const relevantTips: MeasurementTip[] = [];
    if (tableType === "clothing") {
      relevantTips.push(
        measurementTips.find((tip) => tip.title === "Bust/Chest")!,
        measurementTips.find((tip) => tip.title === "Waist")!,
        measurementTips.find((tip) => tip.title === "Hips")!
      );
    } else if (tableType === "shoes") {
      relevantTips.push(measurementTips.find((tip) => tip.title === "Length")!);
    }

    return { sizeCategory, tableType, relevantTips };
  }, [productCategory, productType]);

  const sizeData = sizeCategories[sizeCategory];
  const tableData = sizeData?.tables[tableType];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Size Guide"
      size="xs"
      showCloseButton
    >
      <div className="space-y-8">
        {/* Quick Size Chart */}
        {tableData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900 flex items-center">
                <Ruler size={20} className="mr-2 text-neutral-600" />
                {sizeData.name}
              </h3>
              <Button
                as={Link}
                to="/size-guide"
                variant="ghost"
                size="sm"
                rightIcon={<ExternalLink size={14} />}
                className="text-neutral-600 hover:text-neutral-900"
                onClick={onClose}
              >
                Full Guide
              </Button>
            </div>

            <SizeTable data={tableData} compact />
          </div>
        )}

        {/* Measurement Tips */}
        {relevantTips.length > 0 && (
          <Card variant="minimal" className="bg-neutral-50">
            <CardContent>
              <h4 className="font-medium text-neutral-900 mb-4 flex items-center">
                <User size={16} className="mr-2 text-neutral-600" />
                How to Measure
              </h4>
              <div className="space-y-3">
                {relevantTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium text-neutral-900 text-sm">
                        {tip.title}:
                      </span>
                      <span className="text-neutral-600 text-sm ml-1">
                        {tip.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fit Tips */}
        <Card variant="minimal" className="bg-neutral-50">
          <CardContent>
            <h4 className="font-medium text-neutral-900 mb-4">Fit Tips</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-600">
                  If you're between sizes, we recommend sizing up for comfort
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-600">
                  Check the product description for specific fit notes
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-600">
                  Free exchanges available within 30 days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100">
          <Button
            as={Link}
            to="/size-guide"
            variant="outline"
            size="md"
            fullWidth
            onClick={onClose}
          >
            View Complete Size Guide
          </Button>
          <Button
            as={Link}
            to="/contact"
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClose}
          >
            Need Help? Contact Us
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SizeGuideModal;
