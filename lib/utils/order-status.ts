/**
 * Automatically calculates the projected order status based on time elapsed 
 * since creation. Follows a 3-day (72h) fulfillment cycle.
 */
export function getAutomaticStatus(status: string, createdAt: string) {
    const s = status?.toLowerCase()
    
    // Never override terminal or manual intervention statuses
    const semiTerminalStatuses = ['cancelled', 'failed', 'refunded', 'returned', 'confirmed', 'shipped', 'delivered']
    
    // If the admin has already marked it as Shipped or Delivered manually, 
    // we respect that even if less than 72h have passed.
    if (semiTerminalStatuses.includes(s) && s !== 'confirmed') {
        return s
    }

    const hoursElapsed = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
    
    if (hoursElapsed > 72) return 'delivered'
    if (hoursElapsed > 48) return 'in transit'
    if (hoursElapsed > 24) return 'shipped'
    return 'processing'
}
