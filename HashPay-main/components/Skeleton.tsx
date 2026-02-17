
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'circle' | 'rectangle';
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'text': return 'skeleton-text';
      case 'title': return 'skeleton-title';
      case 'circle': return 'skeleton-circle';
      case 'rectangle': return '';
      default: return '';
    }
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`skeleton ${getVariantClass()} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

export const WalletCardSkeleton: React.FC = () => {
  return (
    <div className="min-w-[160px] p-4 rounded-2xl bg-surface-dark border border-gray-800">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Skeleton variant="rectangle" width="50px" height="28px" />
          <Skeleton variant="circle" width="24px" height="24px" />
        </div>
        <div>
          <Skeleton variant="text" width="80px" />
          <Skeleton variant="text" width="60px" />
        </div>
      </div>
    </div>
  );
};

export const TransactionItemSkeleton: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width="40px" height="40px" />
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" width="120px" />
          <Skeleton variant="text" width="80px" />
        </div>
      </div>
      <Skeleton variant="text" width="60px" />
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Balance Card Skeleton */}
      <div className="rounded-2xl bg-surface-dark p-6 border border-gray-800">
        <Skeleton variant="text" width="100px" className="mb-2" />
        <Skeleton variant="title" width="150px" className="mb-1" />
        <Skeleton variant="text" width="120px" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-4">
        <Skeleton variant="rectangle" height="56px" className="flex-1 rounded-xl" />
        <Skeleton variant="rectangle" height="56px" className="flex-1 rounded-xl" />
      </div>

      {/* Wallets Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="60px" />
        </div>
        <div className="flex gap-4 overflow-x-hidden">
          <WalletCardSkeleton />
          <WalletCardSkeleton />
        </div>
      </div>

      {/* Transactions Skeleton */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton variant="text" width="120px" />
          <Skeleton variant="text" width="80px" />
        </div>
        <div className="rounded-2xl bg-surface-dark border border-gray-800 overflow-hidden">
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
          <TransactionItemSkeleton />
        </div>
      </div>
    </div>
  );
};
export const AssetsSkeleton: React.FC = () => {
  return (
    <div className="flex-1 p-6 flex flex-col gap-10 pt-10">
      <section className="flex flex-col items-center text-center gap-2">
        <Skeleton variant="text" width="100px" className="mb-2" />
        <Skeleton variant="title" width="200px" height="60px" />
      </section>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton variant="rectangle" height="72px" className="rounded-2xl" />
        <Skeleton variant="rectangle" height="72px" className="rounded-2xl" />
      </div>
      <section className="flex flex-col gap-4">
        <Skeleton variant="text" width="120px" className="px-2" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-6 bg-surface-dark/40 border border-white/5 rounded-[2rem]">
              <div className="flex items-center gap-5">
                <Skeleton variant="rectangle" width="56px" height="56px" className="rounded-2xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton variant="text" width="100px" />
                  <Skeleton variant="text" width="60px" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton variant="text" width="80px" />
                <Skeleton variant="text" width="40px" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const NotificationsSkeleton: React.FC = () => {
  return (
    <div className="p-6 flex flex-col gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-surface-dark/40 border border-white/5">
          <Skeleton variant="circle" width="48px" height="48px" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between">
              <Skeleton variant="text" width="100px" />
              <Skeleton variant="text" width="40px" />
            </div>
            <Skeleton variant="text" width="200px" />
          </div>
        </div>
      ))}
    </div>
  );
};
