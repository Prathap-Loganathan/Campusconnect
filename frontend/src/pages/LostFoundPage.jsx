import React, { useState, useEffect } from 'react';
import { lostFoundAPI, fileAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Tag, MapPin, Calendar, CheckCircle, HelpCircle } from 'lucide-react';

const LostFoundPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(''); // ALL, LOST, FOUND
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(null); // Item to claim
  const [proofDetails, setProofDetails] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal Belongings',
    itemType: 'LOST',
    location: '',
    itemDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
  });

  useEffect(() => {
    loadItems();
    if (user && user.role !== 'ROLE_STUDENT') {
      loadClaims();
    }
  }, [filterType, user]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await lostFoundAPI.getAll({ type: filterType || undefined, search: search || undefined });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClaims = async () => {
    try {
      const res = await lostFoundAPI.getAllClaims();
      setClaims(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems();
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await lostFoundAPI.create(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Personal Belongings',
        itemType: 'LOST',
        location: '',
        itemDate: new Date().toISOString().split('T')[0],
        imageUrl: '',
      });
      loadItems();
    } catch (err) {
      alert("Failed to report item");
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!showClaimModal) return;
    try {
      await lostFoundAPI.submitClaim(showClaimModal.id, { proofDetails });
      alert("Claim filed successfully! The admin / item reporter will review your proof.");
      setShowClaimModal(null);
      setProofDetails('');
      loadItems();
    } catch (err) {
      alert("Failed to submit claim");
    }
  };

  const handleReviewClaim = async (claimId, status, comments) => {
    try {
      await lostFoundAPI.reviewClaim(claimId, status, comments);
      loadClaims();
      loadItems();
    } catch (err) {
      alert("Failed to review claim");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campus Lost & Found Hub</h1>
          <p className="text-sm text-slate-500">Report missing belongings or claim items found on campus</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex space-x-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search items by title, category, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-900">
            Search
          </button>
        </form>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${!filterType ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('LOST')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${filterType === 'LOST' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Lost Reports
          </button>
          <button
            onClick={() => setFilterType('FOUND')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${filterType === 'FOUND' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Found Reports
          </button>
        </div>
      </div>

      {/* Items Gallery Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading Lost & Found items...</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">No items match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    item.itemType === 'LOST' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.itemType}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{item.status}</span>
                </div>

                <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.description}</p>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Category: {item.category}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {item.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date: {item.itemDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">By: {item.reporter?.name}</span>
                {item.itemType === 'FOUND' && item.status === 'OPEN' && (
                  <button
                    onClick={() => setShowClaimModal(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm"
                  >
                    Claim Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin / Staff Claim Reviews Drawer */}
      {user && user.role !== 'ROLE_STUDENT' && claims.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-8">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Pending Item Claims Verification</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {claims.map((claim) => (
              <div key={claim.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="font-bold text-slate-800">Claim for: {claim.item?.title}</div>
                  <div className="text-xs text-slate-600">Claimant: {claim.claimant?.name} ({claim.claimant?.email})</div>
                  <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded mt-1">Proof: "{claim.proofDetails}"</div>
                </div>
                {claim.status === 'PENDING' ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReviewClaim(claim.id, 'APPROVED', 'Verified by authority')}
                      className="bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg"
                    >
                      Approve & Return
                    </button>
                    <button
                      onClick={() => handleReviewClaim(claim.id, 'REJECTED', 'Insufficient proof details')}
                      className="bg-rose-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg"
                    >
                      Reject Claim
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-500">{claim.status}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Report Lost / Found Item</h3>
            <form onSubmit={handleCreateItem} className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Report Type</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    value={formData.itemType}
                    onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                  >
                    <option value="LOST">I Lost an Item</option>
                    <option value="FOUND">I Found an Item</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Personal Belongings">Personal Belongings</option>
                    <option value="Electronics">Electronics & Gadgets</option>
                    <option value="Documents">Documents & ID Cards</option>
                    <option value="Keys & Cards">Keys & Cards</option>
                    <option value="Clothing">Clothing & Bags</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Stainless Steel Water Bottle"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Library 2nd Floor"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Mention unique marks, colors, brand, or features..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Post Item Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Claim Item: {showClaimModal.title}</h3>
            <form onSubmit={handleClaimSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Identification Proof / Verification Details</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe unique features, contents inside, password/PIN if phone, wallpaper, or markings that prove this item belongs to you..."
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
                >
                  Submit Ownership Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundPage;
