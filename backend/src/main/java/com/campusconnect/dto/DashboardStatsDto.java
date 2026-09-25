package com.campusconnect.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalComplaints;
    private long openComplaints;
    private long inProgressComplaints;
    private long resolvedComplaints;
    private long closedComplaints;
    private long slaBreaches;
    
    private long totalLostItems;
    private long totalFoundItems;
    private long totalReturnedItems;
    private long pendingClaims;

    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByHostel;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalComplaints, long openComplaints, long inProgressComplaints, long resolvedComplaints, long closedComplaints, long slaBreaches, long totalLostItems, long totalFoundItems, long totalReturnedItems, long pendingClaims, Map<String, Long> complaintsByCategory, Map<String, Long> complaintsByHostel) {
        this.totalComplaints = totalComplaints;
        this.openComplaints = openComplaints;
        this.inProgressComplaints = inProgressComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.closedComplaints = closedComplaints;
        this.slaBreaches = slaBreaches;
        this.totalLostItems = totalLostItems;
        this.totalFoundItems = totalFoundItems;
        this.totalReturnedItems = totalReturnedItems;
        this.pendingClaims = pendingClaims;
        this.complaintsByCategory = complaintsByCategory;
        this.complaintsByHostel = complaintsByHostel;
    }

    public long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; }

    public long getOpenComplaints() { return openComplaints; }
    public void setOpenComplaints(long openComplaints) { this.openComplaints = openComplaints; }

    public long getInProgressComplaints() { return inProgressComplaints; }
    public void setInProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; }

    public long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public long getClosedComplaints() { return closedComplaints; }
    public void setClosedComplaints(long closedComplaints) { this.closedComplaints = closedComplaints; }

    public long getSlaBreaches() { return slaBreaches; }
    public void setSlaBreaches(long slaBreaches) { this.slaBreaches = slaBreaches; }

    public long getTotalLostItems() { return totalLostItems; }
    public void setTotalLostItems(long totalLostItems) { this.totalLostItems = totalLostItems; }

    public long getTotalFoundItems() { return totalFoundItems; }
    public void setTotalFoundItems(long totalFoundItems) { this.totalFoundItems = totalFoundItems; }

    public long getTotalReturnedItems() { return totalReturnedItems; }
    public void setTotalReturnedItems(long totalReturnedItems) { this.totalReturnedItems = totalReturnedItems; }

    public long getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; }

    public Map<String, Long> getComplaintsByCategory() { return complaintsByCategory; }
    public void setComplaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; }

    public Map<String, Long> getComplaintsByHostel() { return complaintsByHostel; }
    public void setComplaintsByHostel(Map<String, Long> complaintsByHostel) { this.complaintsByHostel = complaintsByHostel; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalComplaints;
        private long openComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private long closedComplaints;
        private long slaBreaches;
        private long totalLostItems;
        private long totalFoundItems;
        private long totalReturnedItems;
        private long pendingClaims;
        private Map<String, Long> complaintsByCategory;
        private Map<String, Long> complaintsByHostel;

        public Builder totalComplaints(long totalComplaints) { this.totalComplaints = totalComplaints; return this; }
        public Builder openComplaints(long openComplaints) { this.openComplaints = openComplaints; return this; }
        public Builder inProgressComplaints(long inProgressComplaints) { this.inProgressComplaints = inProgressComplaints; return this; }
        public Builder resolvedComplaints(long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; return this; }
        public Builder closedComplaints(long closedComplaints) { this.closedComplaints = closedComplaints; return this; }
        public Builder slaBreaches(long slaBreaches) { this.slaBreaches = slaBreaches; return this; }
        public Builder totalLostItems(long totalLostItems) { this.totalLostItems = totalLostItems; return this; }
        public Builder totalFoundItems(long totalFoundItems) { this.totalFoundItems = totalFoundItems; return this; }
        public Builder totalReturnedItems(long totalReturnedItems) { this.totalReturnedItems = totalReturnedItems; return this; }
        public Builder pendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; return this; }
        public Builder complaintsByCategory(Map<String, Long> complaintsByCategory) { this.complaintsByCategory = complaintsByCategory; return this; }
        public Builder complaintsByHostel(Map<String, Long> complaintsByHostel) { this.complaintsByHostel = complaintsByHostel; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalComplaints, openComplaints, inProgressComplaints, resolvedComplaints, closedComplaints, slaBreaches, totalLostItems, totalFoundItems, totalReturnedItems, pendingClaims, complaintsByCategory, complaintsByHostel);
        }
    }
}
