import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Clock, Package } from "lucide-react"
import Link from "next/link"

export default async function MerchantDocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return redirect('/auth/login')

  // Fetch all documents for user's shipments
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      shipment:shipments(reference_number, id)
    `)
    .eq('uploaded_by', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching documents:', error)

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial & Cargo Documents</h1>
        <p className="text-muted-foreground">Manage your invoices, delivery bills, and insurance scans</p>
      </div>

      {documents && documents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card key={doc.id} className="hover:border-primary/50 transition-all border-none shadow-md overflow-hidden group">
              <CardHeader className="bg-muted/50 p-4 border-b">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <FileText className="h-4 w-4 text-primary" />
                       <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          {doc.document_type.replace('_', ' ')}
                       </span>
                    </div>
                    <Button variant="ghost" size="icon-sm" asChild>
                       <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                       </a>
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                 <div>
                    <p className="font-bold text-foreground line-clamp-1">{doc.file_name}</p>
                    <Link 
                       href={`/dashboard/shipment/${doc.shipment_id}`}
                       className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                    >
                       <Package className="h-3 w-3" />
                       Shipment #{doc.shipment?.reference_number || doc.shipment?.id.slice(0, 8)}
                    </Link>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-2">
                    <Clock className="h-3 w-3" />
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 py-20 text-center bg-muted/20">
          <CardContent>
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No documents yet</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Your shipping documents will appear here once they are generated or uploaded during the shipping process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
