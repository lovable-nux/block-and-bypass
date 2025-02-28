
import { useAffiliateExceptions } from "@/hooks/useAffiliateExceptions";
import AffiliateForm from "@/components/AffiliateForm";
import AffiliateExceptionsList from "@/components/AffiliateExceptionsList";
import AffiliateInfoAlert from "@/components/AffiliateInfoAlert";
import AffiliateExceptionsHeader from "@/components/AffiliateExceptionsHeader";
import { Plus } from "lucide-react";

const AffiliateExceptions = () => {
  const {
    settings,
    loading,
    activeAffiliate,
    isAdding,
    handleSaveAffiliate,
    handleDeleteAffiliate,
    toggleAffiliateStatus,
    setActiveAffiliate,
    addNewAffiliate
  } = useAffiliateExceptions();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Loading affiliate exception settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <AffiliateExceptionsHeader 
        isEditing={!!activeAffiliate} 
        onAddNew={addNewAffiliate} 
      />
      
      {activeAffiliate ? (
        <AffiliateForm
          affiliate={activeAffiliate}
          onSave={handleSaveAffiliate}
          onCancel={() => {
            setActiveAffiliate(null);
          }}
          onDelete={!isAdding ? () => handleDeleteAffiliate(activeAffiliate.id) : undefined}
        />
      ) : (
        <>
          {settings && (
            <>
              <AffiliateInfoAlert />
              <div className="mt-6">
                <AffiliateExceptionsList
                  affiliateExceptions={settings.affiliateExceptions}
                  onEditAffiliate={setActiveAffiliate}
                  onToggleStatus={toggleAffiliateStatus}
                  onAddFirstException={() => {
                    addNewAffiliate();
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AffiliateExceptions;
