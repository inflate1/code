import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Search, Grid, List, Upload, Loader2, Calendar, Tag, Download } from 'lucide-react';

const DocumentLibrary = ({ documents = [], onDocumentSelect, onFileUpload, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'contracts', label: 'Contracts', count: documents.filter(d => d.category === 'contracts').length },
    { id: 'invoices', label: 'Invoices', count: documents.filter(d => d.category === 'invoices').length },
    { id: 'hr', label: 'HR Forms', count: documents.filter(d => d.category === 'hr').length },
    { id: 'compliance', label: 'Compliance', count: documents.filter(d => d.category === 'compliance').length },
    { id: 'general', label: 'General', count: documents.filter(d => d.category === 'general').length },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.original_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'uploaded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type) => {
    return <FileText className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await onFileUpload(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const DocumentCard = ({ doc }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onDocumentSelect(doc)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getFileIcon(doc.file_type)}
            <h3 className="font-medium text-sm truncate">{doc.original_filename}</h3>
          </div>
          <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
            {doc.status}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(doc.created_at)}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatFileSize(doc.file_size)} • {doc.file_type.toUpperCase()}
          </div>
          <div className="flex flex-wrap gap-1">
            {doc.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {doc.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{doc.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DocumentRow = ({ doc }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-md" onClick={() => onDocumentSelect(doc)}>
      <div className="flex items-center gap-3 flex-1">
        {getFileIcon(doc.file_type)}
        <div>
          <h3 className="font-medium text-sm">{doc.original_filename}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(doc.created_at)} • {formatFileSize(doc.file_size)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
          {doc.status}
        </Badge>
        <Button variant="ghost" size="sm">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Library
        </CardTitle>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.label} ({category.count})
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={selectedCategory} className="mt-4">
            <ScrollArea className="h-[500px] w-full">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Loading documents...</span>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.map((doc) => (
                    <DocumentRow key={doc.id} doc={doc} />
                  ))}
                </div>
              )}
              {!loading && filteredDocuments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No documents found</p>
                  <p className="text-xs mt-2">Try uploading a document or adjusting your search</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentLibrary;