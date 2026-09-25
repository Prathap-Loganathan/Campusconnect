package com.campusconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class ClaimRequest {
    @NotBlank(message = "Proof details are required to claim an item")
    private String proofDetails;

    public ClaimRequest() {}

    public String getProofDetails() { return proofDetails; }
    public void setProofDetails(String proofDetails) { this.proofDetails = proofDetails; }
}
